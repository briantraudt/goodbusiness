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
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)

                    Text(service.shortSummary)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(.secondary)
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
                        .foregroundStyle(.tertiary)
                }
            }
            .frame(maxWidth: .infinity, minHeight: 174, alignment: .topLeading)
            .padding(15)
            .background(.white.opacity(0.86), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(.white.opacity(0.9), lineWidth: 1)
            }
            .shadow(color: .black.opacity(0.06), radius: 18, x: 0, y: 10)
            .scaleEffect(isPressed ? 0.975 : 1)
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
                LinearGradient(
                    colors: [
                        service.accentColor.opacity(0.9),
                        Color(red: 0.08, green: 0.1, blue: 0.14)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                Circle()
                    .fill(.white.opacity(0.12))
                    .frame(width: 180, height: 180)
                    .offset(x: 190, y: -60)

                Circle()
                    .stroke(.white.opacity(0.18), lineWidth: 22)
                    .frame(width: 142, height: 142)
                    .offset(x: 226, y: 44)

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
                            .foregroundStyle(.white.opacity(0.92))
                            .padding(.horizontal, 11)
                            .padding(.vertical, 8)
                            .background(.white.opacity(0.16), in: Capsule())
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Priority \(service.name)")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)

                        Text(service.summary)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundStyle(.white.opacity(0.74))
                            .lineLimit(2)
                    }

                    HStack(spacing: 8) {
                        Text("Start request")
                            .font(.system(size: 15, weight: .bold))

                        Image(systemName: "arrow.right")
                            .font(.system(size: 13, weight: .bold))
                    }
                    .foregroundStyle(.primary)
                    .padding(.horizontal, 15)
                    .padding(.vertical, 11)
                    .background(.white, in: Capsule())
                }
                .padding(20)
            }
            .frame(maxWidth: .infinity, minHeight: 236)
            .clipShape(RoundedRectangle(cornerRadius: 32, style: .continuous))
            .shadow(color: service.accentColor.opacity(0.26), radius: 24, x: 0, y: 16)
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
                .background(Color(red: 0.1, green: 0.12, blue: 0.16), in: Circle())

            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Text(detail)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 12)
        .padding(.vertical, 11)
        .background(.white.opacity(0.76), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(.white.opacity(0.9), lineWidth: 1)
        }
    }
}

struct HomeBackground: View {
    var body: some View {
        LinearGradient(
            colors: [
                Color(red: 0.96, green: 0.97, blue: 0.99),
                Color(red: 0.9, green: 0.94, blue: 0.96),
                Color(red: 0.98, green: 0.98, blue: 0.96)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
        .overlay(alignment: .topTrailing) {
            Circle()
                .fill(Color(red: 0.22, green: 0.54, blue: 0.86).opacity(0.18))
                .frame(width: 220, height: 220)
                .blur(radius: 24)
                .offset(x: 76, y: -84)
        }
        .overlay(alignment: .bottomLeading) {
            Circle()
                .fill(Color(red: 0.1, green: 0.66, blue: 0.48).opacity(0.12))
                .frame(width: 260, height: 260)
                .blur(radius: 30)
                .offset(x: -110, y: 70)
        }
    }
}

#Preview {
    ServiceTile(service: HomeService.defaults[0]) {}
        .padding()
}
