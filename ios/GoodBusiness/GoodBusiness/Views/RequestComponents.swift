import SwiftUI

struct RequestSurface<Content: View>: View {
    let title: String
    let iconName: String
    let color: Color
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 10) {
                Image(systemName: iconName)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(color)
                    .frame(width: 30, height: 30)
                    .background(color.opacity(0.12), in: Circle())

                Text(title)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)
            }

            content
        }
        .padding(16)
        .background(.white.opacity(0.88), in: RoundedRectangle(cornerRadius: 26, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .stroke(.white.opacity(0.9), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.05), radius: 18, x: 0, y: 10)
    }
}

struct RequestField: View {
    let title: String
    @Binding var text: String
    let prompt: String
    var width: CGFloat?
    var keyboardType: UIKeyboardType = .default

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(.secondary)

            TextField(prompt, text: $text)
                .keyboardType(keyboardType)
                .font(.system(size: 16, weight: .medium))
                .textInputAutocapitalization(.words)
                .padding(.horizontal, 14)
                .frame(height: 50)
                .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
        .frame(width: width)
        .frame(maxWidth: width == nil ? .infinity : width, alignment: .leading)
    }
}

struct FlexibleTagRow: View {
    let tags: [String]
    let accentColor: Color
    let onTap: (String) -> Void

    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: 8) {
                tagButtons
            }

            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    ForEach(tags.prefix(2), id: \.self) { tag in
                        tagButton(tag)
                    }
                }

                HStack(spacing: 8) {
                    ForEach(tags.dropFirst(2), id: \.self) { tag in
                        tagButton(tag)
                    }
                }
            }
        }
    }

    private var tagButtons: some View {
        ForEach(tags, id: \.self) { tag in
            tagButton(tag)
        }
    }

    private func tagButton(_ tag: String) -> some View {
        Button {
            onTap(tag)
        } label: {
            Text(tag)
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(accentColor)
                .lineLimit(1)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .background(accentColor.opacity(0.1), in: Capsule())
        }
        .buttonStyle(.plain)
    }
}

struct RequestBackground: View {
    let color: Color

    var body: some View {
        LinearGradient(
            colors: [
                color.opacity(0.12),
                Color(.systemGroupedBackground),
                Color(.systemBackground)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
    }
}
