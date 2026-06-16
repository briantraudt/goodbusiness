import SwiftUI

struct OnboardingShell<Content: View>: View {
    @EnvironmentObject private var onboardingStore: OnboardingStore
    let title: String
    let subtitle: String
    var showsProgress = true
    @ViewBuilder let content: Content

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.97, green: 0.98, blue: 0.98),
                    Color(red: 0.93, green: 0.95, blue: 0.94),
                    Color(red: 0.99, green: 0.98, blue: 0.96)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 22) {
                    if showsProgress {
                        OnboardingProgressView(step: onboardingStore.currentStep)
                    }

                    VStack(alignment: .leading, spacing: 9) {
                        Text(title)
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundStyle(.primary)
                            .lineLimit(3)
                            .minimumScaleFactor(0.82)

                        Text(subtitle)
                            .font(.system(size: 17, weight: .medium))
                            .foregroundStyle(.secondary)
                            .lineSpacing(2)
                    }

                    content
                }
                .padding(.horizontal, 20)
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
                    .foregroundStyle(.secondary)

                Spacer()

                Text(step.title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(.primary)
            }

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(.black.opacity(0.08))
                    Capsule()
                        .fill(Color(red: 0.09, green: 0.12, blue: 0.14))
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
        .background(.white.opacity(0.88), in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .stroke(.white.opacity(0.9), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.05), radius: 20, x: 0, y: 12)
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
                    .foregroundStyle(.secondary)

                if optional {
                    Text("Optional")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.tertiary)
                }
            }

            TextField(prompt, text: $text)
                .keyboardType(keyboardType)
                .textInputAutocapitalization(keyboardType == .emailAddress ? .never : .words)
                .autocorrectionDisabled(keyboardType == .emailAddress)
                .font(.system(size: 17, weight: .medium))
                .padding(.horizontal, 14)
                .frame(height: 52)
                .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .stroke(error == nil ? .clear : Color.red.opacity(0.55), lineWidth: 1)
                }

            if let error {
                Text(error)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.red)
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
                    .foregroundStyle(.secondary)

                if optional {
                    Text("Optional")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.tertiary)
                }
            }

            FlowLayout(spacing: 8) {
                ForEach(options, id: \.self) { option in
                    Button {
                        selection = option
                    } label: {
                        Text(option)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(selection == option ? .white : .primary)
                            .lineLimit(2)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 13)
                            .padding(.vertical, 11)
                            .background(selection == option ? Color(red: 0.09, green: 0.12, blue: 0.14) : Color(.secondarySystemBackground), in: Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }

            if let error {
                Text(error)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.red)
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
                .background(primaryDisabled ? Color(.systemGray3) : Color(red: 0.09, green: 0.12, blue: 0.14), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            }
            .disabled(primaryDisabled || primaryLoading)

            if let secondaryTitle, let secondaryAction {
                Button(secondaryTitle, action: secondaryAction)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(.secondary)
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
