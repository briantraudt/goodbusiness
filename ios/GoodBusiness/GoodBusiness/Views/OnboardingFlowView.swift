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

                Spacer(minLength: 40)

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
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Spacer(minLength: 34)

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

                Spacer(minLength: 0)
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
            OnboardingFieldGroup {
                OnboardingTextField(title: "First name", text: $store.draft.firstName, prompt: "First", error: store.validationMessage(for: "firstName"))
                OnboardingTextField(title: "Last name", text: $store.draft.lastName, prompt: "Last", error: store.validationMessage(for: "lastName"))
                OnboardingTextField(title: "Email", text: $store.draft.email, prompt: "you@example.com", error: store.validationMessage(for: "email"), keyboardType: .emailAddress)
                OnboardingTextField(title: "Phone", text: $store.draft.phone, prompt: "(555) 555-5555", error: store.validationMessage(for: "phone"), keyboardType: .phonePad, showsDivider: false)
            }

            PreferredContactPicker(selection: $store.draft.preferredContactMethod)

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
    @StateObject private var locationResolver = LocationAddressResolver()

    var body: some View {
        OnboardingShell(title: "Where's home?", subtitle: "We'll route every future repair here - no re-typing.") {
            AddressMapPreview(
                isLocating: locationResolver.isLocating,
                errorMessage: locationResolver.errorMessage,
                action: { locationResolver.requestCurrentAddress() }
            )
            .onChange(of: locationResolver.resolvedAddress) { _, resolvedAddress in
                guard let resolvedAddress else { return }
                applyResolvedAddress(resolvedAddress)
            }

            OnboardingFieldGroup {
                OnboardingTextField(title: "Street address", text: $store.draft.addressLine1, prompt: "123 Main St", error: store.validationMessage(for: "addressLine1"))
                OnboardingTextField(title: "Unit / Apt / Suite", text: $store.draft.addressLine2, prompt: "Optional", optional: true)
                OnboardingTextField(title: "City", text: $store.draft.city, prompt: "Austin", error: store.validationMessage(for: "city"))
                OnboardingTextField(title: "State", text: $store.draft.state, prompt: "TX", error: store.validationMessage(for: "state"))
                OnboardingTextField(title: "ZIP code", text: $store.draft.zip, prompt: "78701", error: store.validationMessage(for: "zip"), keyboardType: .numberPad, showsDivider: false)
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

    private func applyResolvedAddress(_ resolvedAddress: ResolvedAddress) {
        if resolvedAddress.street.isEmpty == false {
            store.draft.addressLine1 = resolvedAddress.street
        }
        if resolvedAddress.city.isEmpty == false {
            store.draft.city = resolvedAddress.city
        }
        if resolvedAddress.state.isEmpty == false {
            store.draft.state = resolvedAddress.state
        }
        if resolvedAddress.postalCode.isEmpty == false {
            store.draft.zip = resolvedAddress.postalCode
        }
    }
}

struct HomeBasicsStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        ZStack {
            AppPalette.canvas
                .ignoresSafeArea()

            VStack(spacing: 0) {
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 18) {
                        OnboardingProgressView(step: store.currentStep)

                        VStack(alignment: .leading, spacing: 9) {
                            Text("About your home")
                                .font(.system(size: 28, weight: .bold))
                                .tracking(-0.7)
                                .foregroundStyle(AppPalette.text)
                                .lineLimit(2)
                                .minimumScaleFactor(0.86)

                            Text("Helps us match the right pro the first time.")
                                .font(.system(size: 15.5, weight: .regular))
                                .foregroundStyle(AppPalette.secondaryText)
                                .lineSpacing(2)
                        }

                        VStack(spacing: 11) {
                            BasicsOptionSection(title: "Home type", options: OnboardingOptions.homeTypes, selection: $store.draft.homeType, error: store.validationMessage(for: "homeType"))
                            BasicsOptionSection(title: "Ownership status", options: OnboardingOptions.ownershipStatuses, selection: $store.draft.ownershipStatus, error: store.validationMessage(for: "ownershipStatus"))
                            BasicsOptionSection(title: "Approximate year built", options: OnboardingOptions.yearBuiltRanges, selection: $store.draft.yearBuiltRange, optional: true)
                            BasicsOptionSection(title: "Square footage", options: OnboardingOptions.squareFootageRanges, selection: $store.draft.squareFootageRange, optional: true)
                            BasicsOptionSection(title: "Number of stories", options: OnboardingOptions.stories, selection: $store.draft.stories, optional: true)
                        }
                    }
                    .frame(maxWidth: 390, alignment: .leading)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 24)
                    .padding(.top, 8)
                    .padding(.bottom, 20)
                }

                OnboardingFooter(
                    primaryTitle: "Continue",
                    primaryDisabled: store.canContinue() == false,
                    primaryLoading: false,
                    primaryAction: { store.advance() },
                    secondaryTitle: "Back",
                    secondaryAction: { store.goBack() }
                )
                .frame(maxWidth: 390)
                .padding(.horizontal, 24)
                .padding(.top, 14)
                .padding(.bottom, 18)
                .background {
                    LinearGradient(
                        colors: [
                            AppPalette.canvas.opacity(0),
                            AppPalette.canvas,
                            AppPalette.canvas
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .ignoresSafeArea()
                }
            }
        }
    }
}

struct BasicsOptionSection: View {
    let title: String
    let options: [String]
    @Binding var selection: String
    var error: String?
    var optional = false

    private let columns = [
        GridItem(.adaptive(minimum: 86, maximum: 180), spacing: 8, alignment: .leading)
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 10.5, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.55)
                    .foregroundStyle(AppPalette.muted)

                if optional {
                    Text("Optional")
                        .font(.system(size: 11.5, weight: .semibold))
                        .foregroundStyle(AppPalette.secondaryText.opacity(0.72))
                }
            }

            LazyVGrid(columns: columns, alignment: .leading, spacing: 8) {
                ForEach(options, id: \.self) { option in
                    BasicsOptionChip(title: option, isSelected: selection == option) {
                        selection = option
                    }
                }
            }

            if let error {
                Text(error)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.error)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppPalette.border, lineWidth: 1)
        }
    }
}

struct BasicsOptionChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 13.5, weight: .bold))
                .foregroundStyle(isSelected ? .white : AppPalette.text)
                .lineLimit(3)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.86)
                .frame(maxWidth: .infinity, minHeight: 38)
                .padding(.horizontal, 8)
                .padding(.vertical, 6)
                .background(isSelected ? AppPalette.brand : AppPalette.surface, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(isSelected ? AppPalette.brand : AppPalette.border, lineWidth: 1)
                }
        }
        .buttonStyle(.plain)
    }
}

struct AccessNotesStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        ZStack {
            AppPalette.canvas
                .ignoresSafeArea()

            VStack(spacing: 0) {
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 18) {
                        OnboardingProgressView(step: store.currentStep)

                        VStack(alignment: .leading, spacing: 9) {
                            Text("Getting in")
                                .font(.system(size: 28, weight: .bold))
                                .tracking(-0.7)
                                .foregroundStyle(AppPalette.text)

                            Text("Anything a pro should know before arriving.")
                                .font(.system(size: 15.5, weight: .regular))
                                .foregroundStyle(AppPalette.secondaryText)
                                .lineSpacing(2)
                        }

                        VStack(spacing: 11) {
                            AccessFieldCard {
                                AccessEntryField(title: "Gate code", text: $store.draft.gateCode, prompt: "Code or call box")
                                AccessEntryField(title: "Parking notes", text: $store.draft.parkingNotes, prompt: "Driveway, street, garage")
                                AccessEntryField(title: "Pets", text: $store.draft.petNotes, prompt: "Friendly dog, cat, no pets", showsDivider: false)
                            }

                            AccessNotesCard(text: $store.draft.accessNotes)
                        }
                    }
                    .frame(maxWidth: 390, alignment: .leading)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 24)
                    .padding(.top, 8)
                    .padding(.bottom, 20)
                }

                VStack(spacing: 12) {
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
                            .lineLimit(2)
                    }
                    .foregroundStyle(AppPalette.sage)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 6)
                }
                .frame(maxWidth: 390)
                .padding(.horizontal, 24)
                .padding(.top, 14)
                .padding(.bottom, 18)
                .background {
                    LinearGradient(
                        colors: [
                            AppPalette.canvas.opacity(0),
                            AppPalette.canvas,
                            AppPalette.canvas
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .ignoresSafeArea()
                }
            }
        }
    }
}

struct AccessFieldCard<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            content
        }
        .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppPalette.border, lineWidth: 1)
        }
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

struct AccessEntryField: View {
    let title: String
    @Binding var text: String
    let prompt: String
    var showsDivider = true

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 10.5, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.55)
                    .foregroundStyle(AppPalette.muted)

                Text("Optional")
                    .font(.system(size: 11.5, weight: .semibold))
                    .foregroundStyle(AppPalette.secondaryText.opacity(0.72))
            }

            TextField("", text: $text, prompt: Text(prompt).foregroundStyle(AppPalette.faintText.opacity(0.62)))
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(AppPalette.text)
                .textInputAutocapitalization(.sentences)
                .lineLimit(1)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 13)
        .frame(maxWidth: .infinity, alignment: .leading)
        .overlay(alignment: .bottom) {
            if showsDivider {
                Rectangle()
                    .fill(AppPalette.subtleLine)
                    .frame(height: 1)
                    .padding(.leading, 16)
            }
        }
    }
}

struct AccessNotesCard: View {
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack(spacing: 6) {
                Text("Access notes")
                    .font(.system(size: 10.5, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.55)
                    .foregroundStyle(AppPalette.muted)

                Text("Optional")
                    .font(.system(size: 11.5, weight: .semibold))
                    .foregroundStyle(AppPalette.secondaryText.opacity(0.72))
            }

            TextField("", text: $text, prompt: Text("Side gate, lockbox, special instructions").foregroundStyle(AppPalette.faintText.opacity(0.62)), axis: .vertical)
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(AppPalette.text)
                .textInputAutocapitalization(.sentences)
                .lineLimit(3...5)
                .frame(minHeight: 86, alignment: .topLeading)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppPalette.border, lineWidth: 1)
        }
    }
}

struct OptionalHomeDetailsStepView: View {
    @EnvironmentObject private var store: OnboardingStore

    var body: some View {
        OnboardingShell(title: "Know your home", subtitle: "Optional now - but it makes future repairs faster.") {
            OnboardingFieldGroup {
                OnboardingTextField(title: "Water heater location", text: $store.draft.waterHeaterLocation, prompt: "Garage, attic, closet", optional: true)
                OnboardingTextField(title: "Main water shutoff location", text: $store.draft.waterShutoffLocation, prompt: "Front yard, garage wall", optional: true)
                OnboardingTextField(title: "Electrical panel location", text: $store.draft.electricalPanelLocation, prompt: "Garage, basement, exterior", optional: true)
                OnboardingTextField(title: "HVAC system", text: $store.draft.hvacUnitsCount, prompt: "Add brand & filter size", optional: true, showsDivider: false)
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
    let isLocating: Bool
    let errorMessage: String?
    let action: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button(action: action) {
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
                        if isLocating {
                            ProgressView()
                                .tint(AppPalette.brand)
                                .controlSize(.regular)
                        } else {
                            Image(systemName: "mappin.circle.fill")
                                .font(.system(size: 31, weight: .semibold))
                                .foregroundStyle(AppPalette.brand)
                        }
                        Spacer()
                    }
                    .padding(.top, 46)

                    HStack(spacing: 6) {
                        Circle()
                            .fill(isLocating ? AppPalette.muted : AppPalette.sage)
                            .frame(width: 7, height: 7)
                        Text(isLocating ? "Finding location" : "Use current location")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(isLocating ? AppPalette.muted : AppPalette.sage)
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
            .buttonStyle(.plain)
            .disabled(isLocating)

            if let errorMessage {
                Text(errorMessage)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.error)
                    .padding(.horizontal, 2)
            }
        }
    }
}

struct PreferredContactPicker: View {
    @Binding var selection: String
    private let options = ["Text", "Call", "Email"]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Preferred contact")
                .font(.system(size: 11, weight: .semibold))
                .textCase(.uppercase)
                .tracking(0.55)
                .foregroundStyle(AppPalette.muted)
                .padding(.horizontal, 4)

            HStack(spacing: 0) {
                ForEach(options, id: \.self) { option in
                    Button {
                        selection = option
                    } label: {
                        Text(option)
                            .font(.system(size: 14, weight: selection == option ? .semibold : .medium))
                            .foregroundStyle(selection == option ? AppPalette.text : AppPalette.muted)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 9)
                            .background(selection == option ? AppPalette.surface : .clear, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                            .shadow(color: selection == option ? .black.opacity(0.07) : .clear, radius: 2, x: 0, y: 1)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(4)
            .background(AppPalette.elevatedSurface, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
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
