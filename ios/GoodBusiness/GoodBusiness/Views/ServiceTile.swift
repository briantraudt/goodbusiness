import SwiftUI

struct ServiceTile: View {
    let service: HomeService

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(service.accentColor.opacity(0.14))

                Image(systemName: service.iconName)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundStyle(service.accentColor)
            }
            .frame(width: 48, height: 48)

            VStack(alignment: .leading, spacing: 5) {
                Text(service.name)
                    .font(.headline)
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.82)

                Text(service.summary)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(3)
                    .multilineTextAlignment(.leading)
            }

            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, minHeight: 164, alignment: .topLeading)
        .padding(14)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 8, style: .continuous)
                .stroke(Color(.separator).opacity(0.32), lineWidth: 1)
        }
        .contentShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}

#Preview {
    ServiceTile(service: HomeService.defaults[0])
        .padding()
}
