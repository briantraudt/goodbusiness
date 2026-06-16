import Foundation

@MainActor
final class ServiceStore: ObservableObject {
    @Published private(set) var services = HomeService.defaults
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    private let client = SupabaseRESTClient()

    func loadServices() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let remoteServices = try await client.fetchServices()
            services = remoteServices.isEmpty ? HomeService.defaults : remoteServices
            errorMessage = nil
        } catch {
            services = HomeService.defaults
            errorMessage = error.localizedDescription
        }
    }
}
