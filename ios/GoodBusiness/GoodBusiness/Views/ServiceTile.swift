import SwiftUI

struct ServiceTile: View {
    let service: HomeService
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button {
            action()
        } label: {
            VStack(alignment: .leading, spacing: 13) {
                ZStack {
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .fill(service.accentColor.opacity(0.13))

                    Image(systemName: service.iconName)
                        .font(.system(size: 25, weight: .semibold))
                        .foregroundStyle(service.accentColor)
                }
                .frame(width: 56, height: 56)

                VStack(alignment: .leading, spacing: 5) {
                    Text(service.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(AppPalette.text)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)

                    Text(service.shortSummary)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(AppPalette.secondaryText)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: 0)

                HStack(spacing: 6) {
                    Text(service.estimatedArrival)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(service.accentColor)

                    Spacer(minLength: 0)

                    Image(systemName: "chevron.right")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(AppPalette.muted.opacity(0.72))
                }
            }
            .frame(maxWidth: .infinity, minHeight: 174, alignment: .topLeading)
            .padding(15)
            .appTactileSurface(cornerRadius: 20, isPressed: isPressed)
            .animation(.spring(response: 0.24, dampingFraction: 0.72), value: isPressed)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }
}

struct FeaturedServiceCard: View {
    let service: HomeService
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack(alignment: .bottomLeading) {
                AppPalette.charcoal

                VStack(alignment: .leading, spacing: 22) {
                    HStack(alignment: .top) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 22, style: .continuous)
                                .fill(.white.opacity(0.18))

                            Image(systemName: service.iconName)
                                .font(.system(size: 29, weight: .bold))
                                .foregroundStyle(.white)
                        }
                        .frame(width: 64, height: 64)

                        Spacer()

                        Text("Available \(service.estimatedArrival.lowercased())")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(AppPalette.elevatedSurface)
                            .padding(.horizontal, 11)
                            .padding(.vertical, 8)
                            .background(.white.opacity(0.12), in: Capsule())
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Priority \(service.name)")
                            .font(.system(size: 28, weight: .bold))
                            .tracking(-0.4)
                            .foregroundStyle(.white)

                        Text(service.summary)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundStyle(Color(red: 0.647, green: 0.612, blue: 0.545))
                            .lineLimit(2)
                    }

                    HStack(spacing: 8) {
                        Text("Start request")
                            .font(.system(size: 15, weight: .bold))

                        Image(systemName: "arrow.right")
                            .font(.system(size: 13, weight: .bold))
                    }
                    .foregroundStyle(AppPalette.text)
                    .padding(.horizontal, 15)
                    .padding(.vertical, 11)
                    .background(AppPalette.elevatedSurface, in: Capsule())
                }
                .padding(20)
            }
            .frame(maxWidth: .infinity, minHeight: 236)
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
            .shadow(color: Color(red: 0.157, green: 0.141, blue: 0.118).opacity(0.18), radius: 14, x: 0, y: 7)
        }
        .buttonStyle(.plain)
    }
}

struct HomeStatusPill: View {
    let iconName: String
    let title: String
    let detail: String

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: iconName)
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 30, height: 30)
                .background(AppPalette.charcoal, in: Circle())

            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(AppPalette.text)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Text(detail)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 12)
        .padding(.vertical, 11)
        .appTactileSurface(cornerRadius: 20)
    }
}

#Preview {
    ServiceTile(service: HomeService.defaults[0]) {}
        .padding()
}
