import XCTest
@testable import GoodBusiness

final class OnboardingTests: XCTestCase {
    func testRequiredFieldValidation() {
        let contactErrors = OnboardingValidator.validate(.contact, draft: OnboardingDraft())

        XCTAssertEqual(contactErrors["firstName"], "First name is required.")
        XCTAssertEqual(contactErrors["lastName"], "Last name is required.")
        XCTAssertEqual(contactErrors["email"], "Email is required.")
        XCTAssertEqual(contactErrors["phone"], "Phone is required.")

        var invalidContact = OnboardingDraft()
        invalidContact.firstName = "Sam"
        invalidContact.lastName = "Home"
        invalidContact.email = "not-an-email"
        invalidContact.phone = "123"

        let invalidErrors = OnboardingValidator.validate(.contact, draft: invalidContact)
        XCTAssertEqual(invalidErrors["email"], "Enter a valid email.")
        XCTAssertEqual(invalidErrors["phone"], "Enter a valid US phone number.")
    }

    @MainActor
    func testMovingBetweenOnboardingSteps() {
        let store = OnboardingStore(repository: InMemoryOnboardingRepository())

        XCTAssertEqual(store.currentStep, .welcome)
        store.advance()
        XCTAssertEqual(store.currentStep, .contact)
        store.goBack()
        XCTAssertEqual(store.currentStep, .welcome)
    }

    @MainActor
    func testOptionalHomeDetailsCanBeSkipped() {
        let store = OnboardingStore(repository: InMemoryOnboardingRepository())
        store.goTo(.systems)

        store.skipOptionalDetails()

        XCTAssertEqual(store.currentStep, .review)
    }

    @MainActor
    func testReviewDataIsAvailableFromDraft() {
        let store = OnboardingStore(repository: InMemoryOnboardingRepository())
        store.draft.firstName = "Alex"
        store.draft.lastName = "Taylor"
        store.draft.addressLine1 = "123 Main St"
        store.draft.city = "Austin"

        XCTAssertEqual("\(store.draft.firstName) \(store.draft.lastName)", "Alex Taylor")
        XCTAssertEqual(store.draft.addressLine1, "123 Main St")
        XCTAssertEqual(store.draft.city, "Austin")
    }

    @MainActor
    func testSubmitSavesOnboardingData() async {
        let repository = InMemoryOnboardingRepository()
        let store = OnboardingStore(repository: repository)
        store.draft = completeDraft()

        await store.submit()

        XCTAssertTrue(store.isOnboardingComplete)
        XCTAssertTrue(repository.userProfile?.onboardingComplete == true)
        XCTAssertEqual(repository.homeProfile?.addressLine1, "123 Main St")
        XCTAssertEqual(repository.homeProfile?.homeType, "Single-family")
    }

    @MainActor
    func testCompletedUsersRouteToDashboard() async {
        let repository = InMemoryOnboardingRepository()
        let store = OnboardingStore(repository: repository)
        store.draft = completeDraft()

        await store.submit()

        XCTAssertTrue(store.isOnboardingComplete)
    }

    @MainActor
    func testIncompleteUsersRouteToOnboarding() {
        let store = OnboardingStore(repository: InMemoryOnboardingRepository())

        XCTAssertFalse(store.isOnboardingComplete)
        XCTAssertEqual(store.currentStep, .welcome)
    }

    private func completeDraft() -> OnboardingDraft {
        var draft = OnboardingDraft()
        draft.firstName = "Alex"
        draft.lastName = "Taylor"
        draft.email = "alex@example.com"
        draft.phone = "5125551212"
        draft.addressLine1 = "123 Main St"
        draft.city = "Austin"
        draft.state = "TX"
        draft.zip = "78701"
        draft.homeType = "Single-family"
        draft.ownershipStatus = "Own"
        draft.preferredContactMethod = "Text"
        draft.petsType = "No pets"
        draft.providerEntryPreference = "Depends / ask first"
        return draft
    }
}

final class InMemoryOnboardingRepository: OnboardingRepository {
    var draft: OnboardingDraft?
    var step: OnboardingStep?
    var userProfile: UserProfile?
    var homeProfile: HomeProfile?

    func loadDraft() -> OnboardingDraft? { draft }
    func saveDraft(_ draft: OnboardingDraft) { self.draft = draft }
    func clearDraft() { draft = nil }
    func loadCurrentStep() -> OnboardingStep? { step }
    func saveCurrentStep(_ step: OnboardingStep) { self.step = step }
    func clearCurrentStep() { step = nil }
    func loadUserProfile() -> UserProfile? { userProfile }
    func saveUserProfile(_ profile: UserProfile) { userProfile = profile }
    func loadHomeProfile() -> HomeProfile? { homeProfile }
    func saveHomeProfile(_ profile: HomeProfile) { homeProfile = profile }
}
