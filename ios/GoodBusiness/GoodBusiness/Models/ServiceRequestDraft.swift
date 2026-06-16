import Foundation

struct ServiceRequestDraft {
    var service: HomeService
    var title = ""
    var description = ""
    var addressLine1 = ""
    var city = ""
    var state = ""
    var postalCode = ""
    var preferredDate = Date()
    var preferredTimeWindow = "Anytime"
}
