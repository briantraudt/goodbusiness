import CoreLocation
import Foundation

struct ResolvedAddress: Equatable {
    let street: String
    let city: String
    let state: String
    let postalCode: String
}

@MainActor
final class LocationAddressResolver: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published private(set) var isLocating = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var resolvedAddress: ResolvedAddress?

    private let locationManager = CLLocationManager()
    private let geocoder = CLGeocoder()
    private var shouldRequestLocationAfterAuthorization = false

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
    }

    func requestCurrentAddress() {
        errorMessage = nil
        resolvedAddress = nil

        guard CLLocationManager.locationServicesEnabled() else {
            isLocating = false
            errorMessage = "Turn on Location Services or enter your address manually."
            return
        }

        switch locationManager.authorizationStatus {
        case .notDetermined:
            isLocating = true
            shouldRequestLocationAfterAuthorization = true
            locationManager.requestWhenInUseAuthorization()
        case .authorizedAlways, .authorizedWhenInUse:
            requestOneLocation()
        case .denied, .restricted:
            isLocating = false
            errorMessage = "Allow location access in Settings or enter your address manually."
        @unknown default:
            isLocating = false
            errorMessage = "Location is unavailable. Enter your address manually."
        }
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus

        Task { @MainActor [weak self] in
            self?.handleAuthorizationChange(status)
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else {
            Task { @MainActor [weak self] in
                self?.finishWithError("Location is unavailable. Enter your address manually.")
            }
            return
        }

        Task { @MainActor [weak self] in
            self?.reverseGeocode(location)
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor [weak self] in
            self?.finishWithError("Couldn't find your location. Enter your address manually.")
        }
    }

    private func handleAuthorizationChange(_ status: CLAuthorizationStatus) {
        guard shouldRequestLocationAfterAuthorization else { return }

        switch status {
        case .authorizedAlways, .authorizedWhenInUse:
            shouldRequestLocationAfterAuthorization = false
            requestOneLocation()
        case .denied, .restricted:
            shouldRequestLocationAfterAuthorization = false
            finishWithError("Allow location access in Settings or enter your address manually.")
        case .notDetermined:
            break
        @unknown default:
            shouldRequestLocationAfterAuthorization = false
            finishWithError("Location is unavailable. Enter your address manually.")
        }
    }

    private func requestOneLocation() {
        isLocating = true
        errorMessage = nil
        locationManager.requestLocation()
    }

    private func reverseGeocode(_ location: CLLocation) {
        geocoder.cancelGeocode()
        geocoder.reverseGeocodeLocation(location) { [weak self] placemarks, _ in
            Task { @MainActor [weak self] in
                guard let self else { return }
                guard let placemark = placemarks?.first else {
                    self.finishWithError("Couldn't find your address. Enter it manually.")
                    return
                }

                let street = [placemark.subThoroughfare, placemark.thoroughfare]
                    .compactMap { $0?.trimmingCharacters(in: .whitespacesAndNewlines) }
                    .filter { $0.isEmpty == false }
                    .joined(separator: " ")
                let city = placemark.locality ?? placemark.subLocality ?? ""
                let state = placemark.administrativeArea ?? ""
                let postalCode = placemark.postalCode ?? ""

                guard street.isEmpty == false || city.isEmpty == false || state.isEmpty == false || postalCode.isEmpty == false else {
                    self.finishWithError("Couldn't find your address. Enter it manually.")
                    return
                }

                self.resolvedAddress = ResolvedAddress(street: street, city: city, state: state, postalCode: postalCode)
                self.isLocating = false
                self.errorMessage = nil
            }
        }
    }

    private func finishWithError(_ message: String) {
        isLocating = false
        errorMessage = message
    }
}
