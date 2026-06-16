import Foundation

@MainActor
final class OnboardingStore: ObservableObject {
    @Published var draft: OnboardingDraft
    @Published var currentStep: OnboardingStep
    @Published private(set) var userProfile: UserProfile?
    @Published private(set) var homeProfile: HomeProfile?
    @Published private(set) var isSaving = false
    @Published var saveError: String?
    @Published var validationErrors: [String: String] = [:]

    private let repository: OnboardingRepository

    init(repository: OnboardingRepository = UserDefaultsOnboardingRepository()) {
        self.repository = repository
        self.draft = repository.loadDraft() ?? OnboardingDraft()
        self.currentStep = repository.loadCurrentStep() ?? .welcome
        self.userProfile = repository.loadUserProfile()
        self.homeProfile = repository.loadHomeProfile()

        if userProfile?.onboardingComplete == true, homeProfile == nil {
            self.userProfile = nil
            self.currentStep = .welcome
        }
    }

    var isOnboardingComplete: Bool {
        userProfile?.onboardingComplete == true && homeProfile != nil
    }

    func validationMessage(for field: String) -> String? {
        validationErrors[field]
    }

    func canContinue(from step: OnboardingStep? = nil) -> Bool {
        OnboardingValidator.validate((step ?? currentStep), draft: draft).isEmpty
    }

    func advance() {
        validationErrors = OnboardingValidator.validate(currentStep, draft: draft)
        guard validationErrors.isEmpty else { return }
        guard let nextStep = OnboardingStep(rawValue: currentStep.rawValue + 1) else { return }
        currentStep = nextStep
        persistProgress()
    }

    func goBack() {
        guard let previousStep = OnboardingStep(rawValue: currentStep.rawValue - 1) else { return }
        currentStep = previousStep
        validationErrors = [:]
        persistProgress()
    }

    func skipOptionalDetails() {
        currentStep = .review
        validationErrors = [:]
        persistProgress()
    }

    func goTo(_ step: OnboardingStep) {
        currentStep = step
        validationErrors = [:]
        persistProgress()
    }

    func persistProgress() {
        repository.saveDraft(draft)
        repository.saveCurrentStep(currentStep)
    }

    func submit() async {
        validationErrors = OnboardingValidator.validateAllRequiredSteps(draft: draft)
        guard validationErrors.isEmpty else {
            currentStep = OnboardingValidator.firstInvalidStep(draft: draft) ?? .contact
            persistProgress()
            return
        }

        isSaving = true
        saveError = nil
        defer { isSaving = false }

        do {
            try await Task.sleep(nanoseconds: 350_000_000)
            let now = Date()
            let userId = userProfile?.id ?? UUID()
            let completedUser = UserProfile(
                id: userId,
                firstName: draft.trimmedFirstName,
                lastName: draft.trimmedLastName,
                email: draft.trimmedEmail,
                phone: draft.phone.trimmingCharacters(in: .whitespacesAndNewlines),
                preferredContactMethod: draft.preferredContactMethod,
                onboardingComplete: true,
                createdAt: userProfile?.createdAt ?? now,
                updatedAt: now
            )
            let completedHome = HomeProfile(
                id: homeProfile?.id ?? UUID(),
                userId: userId,
                nickname: "Home",
                addressLine1: draft.addressLine1,
                addressLine2: draft.addressLine2,
                city: draft.city,
                state: draft.state,
                zip: draft.trimmedZip,
                homeType: draft.homeType,
                ownershipStatus: draft.ownershipStatus,
                yearBuiltRange: draft.yearBuiltRange,
                squareFootageRange: draft.squareFootageRange,
                stories: draft.stories,
                gateCode: draft.gateCode,
                parkingNotes: draft.parkingNotes,
                petsType: draft.petsType,
                petNotes: draft.petNotes,
                providerEntryPreference: draft.providerEntryPreference,
                accessNotes: draft.accessNotes,
                waterHeaterType: draft.waterHeaterType,
                waterHeaterLocation: draft.waterHeaterLocation,
                waterShutoffLocation: draft.waterShutoffLocation,
                electricalPanelLocation: draft.electricalPanelLocation,
                hvacUnitsCount: draft.hvacUnitsCount,
                hvacAgeRange: draft.hvacAgeRange,
                hasIrrigation: draft.hasIrrigation,
                hasPool: draft.hasPool,
                hasEvCharger: draft.hasEvCharger,
                hasSolar: draft.hasSolar,
                createdAt: homeProfile?.createdAt ?? now,
                updatedAt: now
            )

            repository.saveUserProfile(completedUser)
            repository.saveHomeProfile(completedHome)
            repository.clearDraft()
            repository.clearCurrentStep()
            userProfile = completedUser
            homeProfile = completedHome
            currentStep = .welcome
        } catch {
            saveError = "We could not save your home profile. Try again."
        }
    }
}

enum OnboardingValidator {
    static func validate(_ step: OnboardingStep, draft: OnboardingDraft) -> [String: String] {
        switch step {
        case .welcome, .systems, .review:
            return [:]
        case .contact:
            return validateContact(draft)
        case .address:
            return validateAddress(draft)
        case .basics:
            return validateBasics(draft)
        case .access:
            return validateAccess(draft)
        }
    }

    static func validateAllRequiredSteps(draft: OnboardingDraft) -> [String: String] {
        validateContact(draft)
            .merging(validateAddress(draft)) { current, _ in current }
            .merging(validateBasics(draft)) { current, _ in current }
            .merging(validateAccess(draft)) { current, _ in current }
    }

    static func firstInvalidStep(draft: OnboardingDraft) -> OnboardingStep? {
        if validateContact(draft).isEmpty == false { return .contact }
        if validateAddress(draft).isEmpty == false { return .address }
        if validateBasics(draft).isEmpty == false { return .basics }
        if validateAccess(draft).isEmpty == false { return .access }
        return nil
    }

    static func validateContact(_ draft: OnboardingDraft) -> [String: String] {
        var errors: [String: String] = [:]
        if draft.trimmedFirstName.isEmpty { errors["firstName"] = "First name is required." }
        if draft.trimmedLastName.isEmpty { errors["lastName"] = "Last name is required." }
        if draft.trimmedEmail.isEmpty {
            errors["email"] = "Email is required."
        } else if isValidEmail(draft.trimmedEmail) == false {
            errors["email"] = "Enter a valid email."
        }
        if draft.digitsOnlyPhone.isEmpty {
            errors["phone"] = "Phone is required."
        } else if isValidUSPhone(draft.phone) == false {
            errors["phone"] = "Enter a valid US phone number."
        }
        return errors
    }

    static func validateAddress(_ draft: OnboardingDraft) -> [String: String] {
        var errors: [String: String] = [:]
        if draft.addressLine1.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { errors["addressLine1"] = "Street address is required." }
        if draft.city.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { errors["city"] = "City is required." }
        if draft.state.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { errors["state"] = "State is required." }
        if draft.trimmedZip.isEmpty {
            errors["zip"] = "ZIP code is required."
        } else if draft.trimmedZip.range(of: #"^\d{5}$"#, options: .regularExpression) == nil {
            errors["zip"] = "Use a 5-digit ZIP."
        }
        return errors
    }

    static func validateBasics(_ draft: OnboardingDraft) -> [String: String] {
        var errors: [String: String] = [:]
        if draft.homeType.isEmpty { errors["homeType"] = "Choose a home type." }
        if draft.ownershipStatus.isEmpty { errors["ownershipStatus"] = "Choose an ownership status." }
        return errors
    }

    static func validateAccess(_ draft: OnboardingDraft) -> [String: String] {
        var errors: [String: String] = [:]
        if draft.preferredContactMethod.isEmpty { errors["preferredContactMethod"] = "Choose a contact method." }
        return errors
    }

    static func isValidEmail(_ value: String) -> Bool {
        value.range(of: #"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"#, options: [.regularExpression, .caseInsensitive]) != nil
    }

    static func isValidUSPhone(_ value: String) -> Bool {
        let digits = value.filter(\.isNumber)
        return digits.count == 10 || (digits.count == 11 && digits.first == "1")
    }
}

protocol OnboardingRepository {
    func loadDraft() -> OnboardingDraft?
    func saveDraft(_ draft: OnboardingDraft)
    func clearDraft()
    func loadCurrentStep() -> OnboardingStep?
    func saveCurrentStep(_ step: OnboardingStep)
    func clearCurrentStep()
    func loadUserProfile() -> UserProfile?
    func saveUserProfile(_ profile: UserProfile)
    func loadHomeProfile() -> HomeProfile?
    func saveHomeProfile(_ profile: HomeProfile)
}

final class UserDefaultsOnboardingRepository: OnboardingRepository {
    private let defaults: UserDefaults
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601
    }

    func loadDraft() -> OnboardingDraft? { load(OnboardingDraft.self, key: Keys.draft) }
    func saveDraft(_ draft: OnboardingDraft) { save(draft, key: Keys.draft) }
    func clearDraft() { defaults.removeObject(forKey: Keys.draft) }
    func loadCurrentStep() -> OnboardingStep? { OnboardingStep(rawValue: defaults.integer(forKey: Keys.step)) }
    func saveCurrentStep(_ step: OnboardingStep) { defaults.set(step.rawValue, forKey: Keys.step) }
    func clearCurrentStep() { defaults.removeObject(forKey: Keys.step) }
    func loadUserProfile() -> UserProfile? { load(UserProfile.self, key: Keys.userProfile) }
    func saveUserProfile(_ profile: UserProfile) { save(profile, key: Keys.userProfile) }
    func loadHomeProfile() -> HomeProfile? { load(HomeProfile.self, key: Keys.homeProfile) }
    func saveHomeProfile(_ profile: HomeProfile) { save(profile, key: Keys.homeProfile) }

    private func load<T: Decodable>(_ type: T.Type, key: String) -> T? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? decoder.decode(type, from: data)
    }

    private func save<T: Encodable>(_ value: T, key: String) {
        guard let data = try? encoder.encode(value) else { return }
        defaults.set(data, forKey: key)
    }

    private enum Keys {
        static let draft = "goodbusiness.onboarding.draft"
        static let step = "goodbusiness.onboarding.step"
        static let userProfile = "goodbusiness.onboarding.userProfile"
        static let homeProfile = "goodbusiness.onboarding.homeProfile"
    }
}
