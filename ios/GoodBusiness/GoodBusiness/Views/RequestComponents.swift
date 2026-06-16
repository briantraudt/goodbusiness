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
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(AppPalette.text)
            }

            content
        }
        .padding(16)
        .appTactileSurface(cornerRadius: 20)
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
                .foregroundStyle(AppPalette.muted)

            TextField(prompt, text: $text)
                .keyboardType(keyboardType)
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(AppPalette.text)
                .textInputAutocapitalization(.words)
                .padding(.horizontal, 14)
                .frame(height: 50)
                .background(AppPalette.elevatedSurface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(AppPalette.border.opacity(0.75), lineWidth: 1)
                }
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
                .background(AppPalette.elevatedSurface, in: Capsule())
                .overlay {
                    Capsule()
                        .stroke(accentColor.opacity(0.26), lineWidth: 1)
                }
        }
        .buttonStyle(.plain)
    }
}

struct RequestBackground: View {
    let color: Color

    var body: some View {
        AppPalette.canvas
            .ignoresSafeArea()
    }
}
