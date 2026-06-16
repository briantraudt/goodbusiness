import SwiftUI

struct OnboardingFlowView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        Group {
            switch store.currentStep {
            case .welcome:
                WelcomeStepView()
            case .contact:
                ContactStepView()
            case .address:
                AddressStepView()
            case .basics:
                HomeBasicsStepView()
            case .access:
                AccessNotesStepView()
            case .systems:
                OptionalHomeDetailsStepView()
            case .review:
                ReviewFinishStepView()
            }
        }
        .onChange(of: store.draft) { _, _ in
            store.persistProgress()
        }
    }
}

struct WelcomeStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(
            title: "Set up your home once.",
            subtitle: "When something breaks, we'll use your home profile to route the right help faster.",
            showsProgress: false
        ) {
            Spacer(minLength: 90)

            VStack(alignment: .leading, spacing: 16) {
                WelcomePoint(iconName: "house.fill", title: "Home details", detail: "Save the basics pros usually ask for.")
                WelcomePoint(iconName: "location.fill", title: "Arrival notes", detail: "Gate, parking, pets, and entry preferences.")
                WelcomePoint(iconName: "checkmark.seal.fill", title: "Faster routing", detail: "Future requests start with context already filled in.")
            }

            Spacer(minLength: 80)

            OnboardingFooter(
                primaryTitle: "Get started",
                primaryDisabled: false,
                primaryLoading: false
            ) {
                store.advance()
            }
        }
    }
}

struct ContactStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "How should we reach you?", subtitle: "This is what we use for scheduling and provider updates.") {
            OnboardingCard {
                OnboardingTextField(title: "First name", text: $store.draft.firstName, prompt: "First", error: store.validationMessage(for: "firstName"))
                OnboardingTextField(title: "Last name", text: $store.draft.lastName, prompt: "Last", error: store.validationMessage(for: "lastName"))
                OnboardingTextField(title: "Email", text: $store.draft.email, prompt: "you@example.com", error: store.validationMessage(for: "email"), keyboardType: .emailAddress)
                OnboardingTextField(title: "Phone", text: $store.draft.phone, prompt: "(555) 555-5555", error: store.validationMessage(for: "phone"), keyboardType: .phonePad)
            }

            OnboardingFooter(
                primaryTitle: "Continue",
                primaryDisabled: store.canContinue() == false,
                primaryLoading: false,
                primaryAction: { store.advance() },
                secondaryTitle: "Back",
                secondaryAction: { store.goBack() }
            )
        }
    }
}

struct AddressStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Where is the home?", subtitle: "A clean address helps us match service coverage correctly.") {
            OnboardingCard {
                OnboardingTextField(title: "Street address", text: $store.draft.addressLine1, prompt: "123 Main St", error: store.validationMessage(for: "addressLine1"))
                OnboardingTextField(title: "Unit / Apt / Suite", text: $store.draft.addressLine2, prompt: "Unit 2", optional: true)
                OnboardingTextField(title: "City", text: $store.draft.city, prompt: "Austin", error: store.validationMessage(for: "city"))
                OnboardingTextField(title: "State", text: $store.draft.state, prompt: "TX", error: store.validationMessage(for: "state"))
                OnboardingTextField(title: "ZIP code", text: $store.draft.zip, prompt: "78701", error: store.validationMessage(for: "zip"), keyboardType: .numberPad)
            }

            OnboardingFooter(
                primaryTitle: "Continue",
                primaryDisabled: store.canContinue() == false,
                primaryLoading: false,
                primaryAction: { store.advance() },
                secondaryTitle: "Back",
                secondaryAction: { store.goBack() }
            )
        }
    }
}

struct HomeBasicsStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "A few home basics.", subtitle: "Just enough context to send the right kind of help.") {
            OnboardingCard {
                OptionGroup(title: "Home type", options: OnboardingOptions.homeTypes, selection: $store.draft.homeType, error: store.validationMessage(for: "homeType"))
                OptionGroup(title: "Ownership status", options: OnboardingOptions.ownershipStatuses, selection: $store.draft.ownershipStatus, error: store.validationMessage(for: "ownershipStatus"))
                OptionGroup(title: "Approximate year built", options: OnboardingOptions.yearBuiltRanges, selection: $store.draft.yearBuiltRange, optional: true)
                OptionGroup(title: "Square footage", options: OnboardingOptions.squareFootageRanges, selection: $store.draft.squareFootageRange, optional: true)
                OptionGroup(title: "Number of stories", options: OnboardingOptions.stories, selection: $store.draft.stories, optional: true)
            }

            OnboardingFooter(
                primaryTitle: "Continue",
                primaryDisabled: store.canContinue() == false,
                primaryLoading: false,
                primaryAction: { store.advance() },
                secondaryTitle: "Back",
                secondaryAction: { store.goBack() }
            )
        }
    }
}

struct AccessNotesStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Help pros arrive prepared.", subtitle: "Access notes prevent back-and-forth on service day.") {
            OnboardingCard {
                OptionGroup(title: "Preferred contact method", options: OnboardingOptions.contactMethods, selection: $store.draft.preferredContactMethod, error: store.validationMessage(for: "preferredContactMethod"))
                OnboardingTextField(title: "Gate code", text: $store.draft.gateCode, prompt: "Code or call box", optional: true)
                OnboardingTextField(title: "Parking notes", text: $store.draft.parkingNotes, prompt: "Driveway, street, garage", optional: true)
                OptionGroup(title: "Pets in home?", options: OnboardingOptions.petTypes, selection: $store.draft.petsType, error: store.validationMessage(for: "petsType"))
                OnboardingTextField(title: "Pet notes", text: $store.draft.petNotes, prompt: "Friendly dog, keep cat inside", optional: true)
                OptionGroup(title: "Can a provider enter if you are not home?", options: OnboardingOptions.entryPreferences, selection: $store.draft.providerEntryPreference, error: store.validationMessage(for: "providerEntryPreference"))
                OnboardingTextField(title: "General access notes", text: $store.draft.accessNotes, prompt: "Side door, lockbox, special instructions", optional: true)
            }

            OnboardingFooter(
                primaryTitle: "Continue",
                primaryDisabled: store.canContinue() == false,
                primaryLoading: false,
                primaryAction: { store.advance() },
                secondaryTitle: "Back",
                secondaryAction: { store.goBack() }
            )
        }
    }
}

struct OptionalHomeDetailsStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Add details that help pros show up prepared.", subtitle: "You can skip this now and add it later.") {
            OnboardingCard {
                OptionGroup(title: "Water heater type", options: OnboardingOptions.waterHeaterTypes, selection: $store.draft.waterHeaterType, optional: true)
                OnboardingTextField(title: "Water heater location", text: $store.draft.waterHeaterLocation, prompt: "Garage, attic, closet", optional: true)
                OnboardingTextField(title: "Main water shutoff location", text: $store.draft.waterShutoffLocation, prompt: "Front yard, garage wall", optional: true)
                OnboardingTextField(title: "Electrical panel location", text: $store.draft.electricalPanelLocation, prompt: "Garage, basement, exterior", optional: true)
                OptionGroup(title: "Number of HVAC units", options: OnboardingOptions.hvacUnitCounts, selection: $store.draft.hvacUnitsCount, optional: true)
                OptionGroup(title: "HVAC age", options: OnboardingOptions.hvacAgeRanges, selection: $store.draft.hvacAgeRange, optional: true)
                OptionGroup(title: "Has irrigation system?", options: OnboardingOptions.yesNoNotSure, selection: $store.draft.hasIrrigation, optional: true)
                OptionGroup(title: "Has pool?", options: OnboardingOptions.yesNo, selection: $store.draft.hasPool, optional: true)
                OptionGroup(title: "Has EV charger?", options: OnboardingOptions.yesNo, selection: $store.draft.hasEvCharger, optional: true)
                OptionGroup(title: "Has solar?", options: OnboardingOptions.yesNo, selection: $store.draft.hasSolar, optional: true)
            }

            OnboardingFooter(
                primaryTitle: "Continue",
                primaryDisabled: false,
                primaryLoading: false,
                primaryAction: { store.advance() },
                secondaryTitle: "Skip for now",
                secondaryAction: { store.skipOptionalDetails() }
            )

            Button("Back") {
                store.goBack()
            }
            .font(.system(size: 15, weight: .bold))
            .foregroundStyle(AppPalette.secondaryText)
            .frame(maxWidth: .infinity)
        }
    }
}

struct ReviewFinishStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Review your home profile.", subtitle: "Make sure the essentials are right. You can update this later.") {
            VStack(spacing: 12) {
                ReviewSection(title: "Contact", editAction: { store.goTo(.contact) }, rows: [
                    ("Name", "\(store.draft.firstName) \(store.draft.lastName)"),
                    ("Email", store.draft.email),
                    ("Phone", store.draft.phone),
                    ("Preferred", store.draft.preferredContactMethod)
                ])

                ReviewSection(title: "Address", editAction: { store.goTo(.address) }, rows: [
                    ("Street", [store.draft.addressLine1, store.draft.addressLine2].filter { $0.isEmpty == false }.joined(separator: ", ")),
                    ("City", store.draft.city),
                    ("State", store.draft.state),
                    ("ZIP", store.draft.zip)
                ])

                ReviewSection(title: "Home basics", editAction: { store.goTo(.basics) }, rows: [
                    ("Type", store.draft.homeType),
                    ("Ownership", store.draft.ownershipStatus),
                    ("Built", store.draft.yearBuiltRange),
                    ("Size", store.draft.squareFootageRange),
                    ("Stories", store.draft.stories)
                ])

                ReviewSection(title: "Access notes", editAction: { store.goTo(.access) }, rows: [
                    ("Gate", store.draft.gateCode),
                    ("Parking", store.draft.parkingNotes),
                    ("Pets", store.draft.petsType),
                    ("Entry", store.draft.providerEntryPreference),
                    ("Notes", store.draft.accessNotes)
                ])

                ReviewSection(title: "Optional home details", editAction: { store.goTo(.systems) }, rows: [
                    ("Water heater", store.draft.waterHeaterType),
                    ("Water shutoff", store.draft.waterShutoffLocation),
                    ("Electrical panel", store.draft.electricalPanelLocation),
                    ("HVAC units", store.draft.hvacUnitsCount),
                    ("HVAC age", store.draft.hvacAgeRange),
                    ("Irrigation", store.draft.hasIrrigation),
                    ("Pool", store.draft.hasPool),
                    ("EV charger", store.draft.hasEvCharger),
                    ("Solar", store.draft.hasSolar)
                ])
            }

            if let saveError = store.saveError {
                Text(saveError)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(AppPalette.error)
                    .padding(14)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppPalette.error.opacity(0.08), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(AppPalette.error.opacity(0.18), lineWidth: 1)
                    }
            }

            OnboardingFooter(
                primaryTitle: "Save home",
                primaryDisabled: false,
                primaryLoading: store.isSaving,
                primaryAction: { Task { await store.submit() } },
                secondaryTitle: "Back",
                secondaryAction: { store.goBack() }
            )
        }
    }
}

struct WelcomePoint: View {
    let iconName: String
    let title: String
    let detail: String

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: iconName)
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(AppPalette.charcoal, in: RoundedRectangle(cornerRadius: 15, style: .continuous))

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(AppPalette.text)
                Text(detail)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)
            }
        }
        .padding(14)
        .appTactileSurface(cornerRadius: 20)
    }
}

struct ReviewSection: View {
    let title: String
    let editAction: () -> Void
    let rows: [(String, String)]

    private var visibleRows: [(String, String)] {
        rows.filter { $0.1.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false }
    }

    var body: some View {
        OnboardingCard {
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(AppPalette.text)

                Spacer()

                Button("Edit", action: editAction)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(AppPalette.brand)
            }

            if visibleRows.isEmpty {
                Text("No details added.")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)
            } else {
                VStack(spacing: 10) {
                    ForEach(visibleRows, id: \.0) { row in
                        HStack(alignment: .top) {
                            Text(row.0)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundStyle(AppPalette.muted)
                                .frame(width: 92, alignment: .leading)

                            Text(row.1)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppPalette.text)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    OnboardingFlowView()
        .environmentObject(OnboardingStore())
}
