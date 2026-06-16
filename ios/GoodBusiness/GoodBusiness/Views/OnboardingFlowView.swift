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
        ZStack {
            AppPalette.canvas
                .ignoresSafeArea()

            VStack(alignment: .leading, spacing: 0) {
                KeplyMark(size: 46)
                    .padding(.top, 30)

                Spacer(minLength: 0)

                VStack(alignment: .leading, spacing: 0) {
                    Text("Set up your home once.")
                        .font(.system(size: 34, weight: .bold))
                        .tracking(-1.02)
                        .lineSpacing(-1)
                        .foregroundStyle(AppPalette.text)
                        .frame(maxWidth: 290, alignment: .leading)

                    Text("When something breaks, tap one button. We handle the routing, the right pro, and the scheduling - no phone-tag.")
                        .font(.system(size: 17, weight: .regular))
                        .lineSpacing(3)
                        .foregroundStyle(AppPalette.secondaryText)
                        .padding(.top, 16)
                        .frame(maxWidth: 315, alignment: .leading)

                    VStack(alignment: .leading, spacing: 10) {
                        WelcomePoint(number: "1", title: "Tell us what's wrong")
                        WelcomePoint(number: "2", title: "We match a vetted pro")
                        WelcomePoint(number: "3", title: "They arrive, you relax")
                    }
                    .padding(.top, 26)

                    VStack(spacing: 12) {
                        Button {
                            store.advance()
                        } label: {
                            Text("Get started")
                                .font(.system(size: 17, weight: .semibold))
                                .foregroundStyle(Color(red: 0.988, green: 0.969, blue: 0.937))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 17)
                                .background(AppPalette.brand, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                                .shadow(color: AppPalette.brand.opacity(0.36), radius: 22, x: 0, y: 10)
                        }
                        .buttonStyle(.plain)

                        Button {
                        } label: {
                            Text("I already have an account")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(Color(red: 0.486, green: 0.459, blue: 0.404))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 8)
                        }
                        .buttonStyle(.plain)

                        Text("About 2 minutes · Your details stay private")
                            .font(.system(size: 12.5, weight: .regular))
                            .foregroundStyle(AppPalette.muted)
                            .frame(maxWidth: .infinity)
                    }
                    .padding(.top, 28)
                }
            }
            .padding(.horizontal, 26)
            .padding(.bottom, 28)
        }
    }
}

struct ContactStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Your details", subtitle: "So a pro can reach you. Never shared or sold.") {
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
        OnboardingShell(title: "Where's home?", subtitle: "We'll route every future repair here - no re-typing.") {
            AddressMapPreview()

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
        OnboardingShell(title: "About your home", subtitle: "Helps us match the right pro the first time.") {
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
        OnboardingShell(title: "Getting in", subtitle: "Anything a pro should know before arriving.") {
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

            HStack(spacing: 9) {
                Image(systemName: "shield")
                    .font(.system(size: 14, weight: .medium))
                Text("Shared only with your assigned pro.")
                    .font(.system(size: 13, weight: .semibold))
            }
            .foregroundStyle(AppPalette.sage)
            .padding(.horizontal, 4)
        }
    }
}

struct OptionalHomeDetailsStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Know your home", subtitle: "Optional now - but it makes future repairs faster.") {
            OnboardingCard {
                OnboardingTextField(title: "Water heater location", text: $store.draft.waterHeaterLocation, prompt: "Garage, attic, closet", optional: true)
                OnboardingTextField(title: "Main water shutoff location", text: $store.draft.waterShutoffLocation, prompt: "Front yard, garage wall", optional: true)
                OnboardingTextField(title: "Electrical panel location", text: $store.draft.electricalPanelLocation, prompt: "Garage, basement, exterior", optional: true)
                OptionGroup(title: "HVAC system", options: OnboardingOptions.hvacUnitCounts, selection: $store.draft.hvacUnitsCount, optional: true)
            }

            OnboardingFooter(
                primaryTitle: "Save my home",
                primaryDisabled: false,
                primaryLoading: store.isSaving,
                primaryAction: { Task { await store.submit() } },
                secondaryTitle: "Skip for now",
                secondaryAction: { Task { await store.submit() } }
            )
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
    let number: String
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Text(number)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(AppPalette.brand)
                .frame(width: 26, height: 26)
                .background(AppPalette.profileFill, in: RoundedRectangle(cornerRadius: 8, style: .continuous))

            Text(title)
                .font(.system(size: 15, weight: .regular))
                .foregroundStyle(AppPalette.bodyText)
        }
    }
}

struct AddressMapPreview: View {
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.906, green: 0.878, blue: 0.812),
                    Color(red: 0.847, green: 0.847, blue: 0.769)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            GridPattern()
                .stroke(.white.opacity(0.5), lineWidth: 1)

            VStack(spacing: 0) {
                Image(systemName: "mappin.circle.fill")
                    .font(.system(size: 31, weight: .semibold))
                    .foregroundStyle(AppPalette.brand)
                Spacer()
            }
            .padding(.top, 46)

            HStack(spacing: 6) {
                Circle()
                    .fill(AppPalette.sage)
                    .frame(width: 7, height: 7)
                Text("Use current location")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.sage)
            }
            .padding(.horizontal, 11)
            .padding(.vertical, 6)
            .background(AppPalette.surface.opacity(0.92), in: RoundedRectangle(cornerRadius: 9, style: .continuous))
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
            .padding(.leading, 12)
            .padding(.bottom, 10)
        }
        .frame(height: 124)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppPalette.border, lineWidth: 1)
        }
    }
}

struct GridPattern: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let spacing: CGFloat = 26
        var x = rect.minX
        while x <= rect.maxX {
            path.move(to: CGPoint(x: x, y: rect.minY))
            path.addLine(to: CGPoint(x: x, y: rect.maxY))
            x += spacing
        }
        var y = rect.minY
        while y <= rect.maxY {
            path.move(to: CGPoint(x: rect.minX, y: y))
            path.addLine(to: CGPoint(x: rect.maxX, y: y))
            y += spacing
        }
        return path
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
