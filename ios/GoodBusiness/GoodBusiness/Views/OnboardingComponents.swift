import SwiftUI

struct OnboardingShell<Content: View>: View {
    @EnvironmentObject private var onboardingStore: OnboardingStore
    let title: String
    let subtitle: String
    var showsProgress = true
    @ViewBuilder let content: Content

    var body: some View {
        ZStack {
            AppPalette.canvas
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 22) {
                    if showsProgress {
                        OnboardingProgressView(step: onboardingStore.currentStep)
                    }

                    VStack(alignment: .leading, spacing: 9) {
                        Text(title)
                            .font(.system(size: showsProgress ? 28 : 34, weight: .bold))
                            .tracking(showsProgress ? -0.7 : -1.02)
                            .foregroundStyle(AppPalette.text)
                            .lineLimit(3)
                            .minimumScaleFactor(0.82)

                        Text(subtitle)
                            .font(.system(size: showsProgress ? 15.5 : 17, weight: .regular))
                            .foregroundStyle(AppPalette.secondaryText)
                            .lineSpacing(2)
                    }

                    content
                }
                .padding(.horizontal, showsProgress ? 24 : 26)
                .padding(.top, showsProgress ? 8 : 30)
                .padding(.bottom, 34)
            }
        }
    }
}

struct OnboardingProgressView: View {
    @EnvironmentObject private var onboardingStore: OnboardingStore
    let step: OnboardingStep

    private var visibleIndex: Int {
        switch step {
        case .contact: 1
        case .address: 2
        case .basics: 3
        case .access: 4
        case .systems, .review: 5
        case .welcome: 0
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            Button {
                onboardingStore.goBack()
            } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(AppPalette.text)
                    .frame(width: 38, height: 38)
                    .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .stroke(AppPalette.border, lineWidth: 1)
                    }
            }
            .buttonStyle(.plain)
            .opacity(step == .contact ? 0 : 1)

            HStack(spacing: 6) {
                ForEach(1...5, id: \.self) { index in
                    Capsule()
                        .fill(index <= visibleIndex ? AppPalette.brand : AppPalette.progressTrack)
                        .frame(height: 4)
                }
            }
            .frame(maxWidth: .infinity)

            Text("\(visibleIndex)/5")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(AppPalette.muted)
        }
    }
}

struct OnboardingCard<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
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

struct OnboardingTextField: View {
    let title: String
    @Binding var text: String
    var prompt: String
    var error: String?
    var optional = false
    var keyboardType: UIKeyboardType = .default

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 5) {
                Text(title)
                    .font(.system(size: 11, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.55)
                    .foregroundStyle(AppPalette.muted)

                if optional {
                    Text("Optional")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(AppPalette.secondaryText.opacity(0.72))
                }
            }

            TextField(prompt, text: $text)
                .keyboardType(keyboardType)
                .textInputAutocapitalization(keyboardType == .emailAddress ? .never : .words)
                .autocorrectionDisabled(keyboardType == .emailAddress)
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(AppPalette.text)
                .padding(.horizontal, 16)
                .frame(height: 48)
                .background(AppPalette.surface)

            if let error {
                Text(error)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.error)
            }
        }
    }
}

struct OptionGroup: View {
    let title: String
    let options: [String]
    @Binding var selection: String
    var error: String?
    var optional = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 5) {
                Text(title)
                    .font(.system(size: 11, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.55)
                    .foregroundStyle(AppPalette.muted)

                if optional {
                    Text("Optional")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(AppPalette.secondaryText.opacity(0.72))
                }
            }

            FlowLayout(spacing: 8) {
                ForEach(options, id: \.self) { option in
                    Button {
                        selection = option
                    } label: {
                        Text(option)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(selection == option ? .white : AppPalette.text)
                            .lineLimit(2)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 13)
                            .padding(.vertical, 10)
                            .background(selection == option ? AppPalette.brand : AppPalette.surface, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                            .overlay {
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .stroke(selection == option ? AppPalette.brand : AppPalette.border, lineWidth: 1)
                            }
                    }
                    .buttonStyle(.plain)
                }
            }

            if let error {
                Text(error)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.error)
            }
        }
    }
}

struct OnboardingFooter: View {
    let primaryTitle: String
    let primaryDisabled: Bool
    let primaryLoading: Bool
    let primaryAction: () -> Void
    var secondaryTitle: String?
    var secondaryAction: (() -> Void)?

    var body: some View {
        VStack(spacing: 10) {
            Button(action: primaryAction) {
                HStack {
                    if primaryLoading {
                        ProgressView()
                            .tint(.white)
                    }

                    Text(primaryTitle)
                        .font(.system(size: 17, weight: .bold))
                }
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 17)
                .background(primaryDisabled ? AppPalette.faintText.opacity(0.42) : AppPalette.brand, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .shadow(color: primaryDisabled ? .clear : AppPalette.brand.opacity(0.36), radius: 22, x: 0, y: 10)
            }
            .disabled(primaryDisabled || primaryLoading)

            if let secondaryTitle, let secondaryAction {
                Button(secondaryTitle, action: secondaryAction)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(AppPalette.secondaryText)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
        }
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? 0
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x > 0, x + size.width > maxWidth {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }

        return CGSize(width: maxWidth, height: y + rowHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x > bounds.minX, x + size.width > bounds.maxX {
                x = bounds.minX
                y += rowHeight + spacing
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
