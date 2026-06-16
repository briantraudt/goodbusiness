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
                            .font(.system(size: 38, weight: .bold, design: .rounded))
                            .tracking(-0.6)
                            .foregroundStyle(AppPalette.text)
                            .lineLimit(3)
                            .minimumScaleFactor(0.82)

                        Text(subtitle)
                            .font(.system(size: 18, weight: .medium))
                            .foregroundStyle(AppPalette.secondaryText)
                            .lineSpacing(2)
                    }

                    content
                }
                .padding(.horizontal, 22)
                .padding(.top, 24)
                .padding(.bottom, 34)
            }
        }
    }
}

struct OnboardingProgressView: View {
    let step: OnboardingStep

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Step \(step.progressIndex) of \(OnboardingStep.count)")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(AppPalette.muted)

                Spacer()

                Text(step.title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(AppPalette.text)
            }

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(AppPalette.surfaceLedge.opacity(0.78))
                    Capsule()
                        .fill(AppPalette.brand)
                        .frame(width: proxy.size.width * CGFloat(step.progressIndex) / CGFloat(OnboardingStep.count))
                }
            }
            .frame(height: 6)
        }
    }
}

struct OnboardingCard<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content
        }
        .padding(16)
        .appTactileSurface(cornerRadius: 20)
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
                    .font(.system(size: 13, weight: .bold))
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
                .padding(.horizontal, 14)
                .frame(height: 52)
                .background(AppPalette.elevatedSurface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(error == nil ? AppPalette.border.opacity(0.75) : AppPalette.error.opacity(0.65), lineWidth: 1)
                }

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
                    .font(.system(size: 13, weight: .bold))
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
                            .padding(.vertical, 11)
                            .background(selection == option ? AppPalette.charcoal : AppPalette.elevatedSurface, in: Capsule())
                            .overlay {
                                Capsule()
                                    .stroke(selection == option ? AppPalette.charcoal : AppPalette.border, lineWidth: 1)
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
                .background(primaryDisabled ? AppPalette.secondaryText.opacity(0.34) : AppPalette.charcoal, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
                .shadow(color: primaryDisabled ? .clear : AppPalette.charcoal.opacity(0.2), radius: 14, x: 0, y: 8)
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
