import Foundation

struct UserProfile: Codable, Equatable {
    var id: UUID
    var firstName: String
    var lastName: String
    var email: String
    var phone: String
    var preferredContactMethod: String
    var onboardingComplete: Bool
    var createdAt: Date
    var updatedAt: Date
}

struct HomeProfile: Codable, Equatable {
    var id: UUID
    var userId: UUID
    var nickname: String
    var addressLine1: String
    var addressLine2: String
    var city: String
    var state: String
    var zip: String
    var homeType: String
    var ownershipStatus: String
    var yearBuiltRange: String
    var squareFootageRange: String
    var stories: String
    var gateCode: String
    var parkingNotes: String
    var petsType: String
    var petNotes: String
    var providerEntryPreference: String
    var accessNotes: String
    var waterHeaterType: String
    var waterHeaterLocation: String
    var waterShutoffLocation: String
    var electricalPanelLocation: String
    var hvacUnitsCount: String
    var hvacAgeRange: String
    var hasIrrigation: String
    var hasPool: String
    var hasEvCharger: String
    var hasSolar: String
    var createdAt: Date
    var updatedAt: Date
}

struct OnboardingDraft: Codable, Equatable {
    var firstName = ""
    var lastName = ""
    var email = ""
    var phone = ""
    var addressLine1 = ""
    var addressLine2 = ""
    var city = ""
    var state = ""
    var zip = ""
    var homeType = ""
    var ownershipStatus = ""
    var yearBuiltRange = ""
    var squareFootageRange = ""
    var stories = ""
    var preferredContactMethod = ""
    var gateCode = ""
    var parkingNotes = ""
    var petsType = ""
    var petNotes = ""
    var providerEntryPreference = ""
    var accessNotes = ""
    var waterHeaterType = ""
    var waterHeaterLocation = ""
    var waterShutoffLocation = ""
    var electricalPanelLocation = ""
    var hvacUnitsCount = ""
    var hvacAgeRange = ""
    var hasIrrigation = ""
    var hasPool = ""
    var hasEvCharger = ""
    var hasSolar = ""

    var trimmedFirstName: String { firstName.trimmingCharacters(in: .whitespacesAndNewlines) }
    var trimmedLastName: String { lastName.trimmingCharacters(in: .whitespacesAndNewlines) }
    var trimmedEmail: String { email.trimmingCharacters(in: .whitespacesAndNewlines) }
    var digitsOnlyPhone: String { phone.filter(\.isNumber) }
    var trimmedZip: String { zip.trimmingCharacters(in: .whitespacesAndNewlines) }
}

enum OnboardingStep: Int, CaseIterable, Codable, Identifiable {
    case welcome
    case contact
    case address
    case basics
    case access
    case systems
    case review

    var id: Int { rawValue }
    var progressIndex: Int { rawValue + 1 }
    static var count: Int { allCases.count }

    var title: String {
        switch self {
        case .welcome: "Welcome"
        case .contact: "Contact"
        case .address: "Address"
        case .basics: "Home basics"
        case .access: "Access"
        case .systems: "Home details"
        case .review: "Review"
        }
    }
}

enum OnboardingOptions {
    static let homeTypes = ["Single-family", "Townhome", "Condo", "Apartment", "Duplex", "Other"]
    static let ownershipStatuses = ["Own", "Rent", "Property manager / landlord handles repairs", "Not sure"]
    static let yearBuiltRanges = ["Before 1970", "1970-1990", "1990-2010", "2010+", "Not sure"]
    static let squareFootageRanges = ["Under 1,500", "1,500-2,500", "2,500-4,000", "4,000+", "Not sure"]
    static let stories = ["1", "2", "3+"]
    static let contactMethods = ["Text", "Call", "Email"]
    static let petTypes = ["No pets", "Dog", "Cat", "Multiple pets", "Other"]
    static let entryPreferences = ["Yes", "No", "Depends / ask first"]
    static let waterHeaterTypes = ["Tank", "Tankless", "Not sure"]
    static let hvacUnitCounts = ["1", "2", "3+", "Not sure"]
    static let hvacAgeRanges = ["0-5 years", "6-10 years", "10+ years", "Not sure"]
    static let yesNoNotSure = ["Yes", "No", "Not sure"]
    static let yesNo = ["Yes", "No"]
}
