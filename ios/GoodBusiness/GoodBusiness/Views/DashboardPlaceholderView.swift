import SwiftUI

struct DashboardPlaceholderView: View {
    private let services = [
        ("Plumbing", "wrench.and.screwdriver.fill"),
        ("Electrical", "bolt.fill"),
        ("HVAC", "fan.fill"),
        ("Appliance Repair", "oven.fill"),
        ("Lawn / Yard", "leaf.fill"),
        ("Handyman", "hammer.fill")
    ]

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    var body: some View {
        ZStack {
            HomeBackground()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 22) {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("What do you need help with?")
                            .font(.system(size: 38, weight: .bold, design: .rounded))
                            .foregroundStyle(.primary)
                            .lineLimit(2)
                            .minimumScaleFactor(0.86)

                        Text("Your home profile is saved. Next we'll build the six service buttons.")
                            .font(.system(size: 17, weight: .medium))
                            .foregroundStyle(.secondary)
                    }
                    .padding(.top, 28)

                    HStack(spacing: 10) {
                        HomeStatusPill(iconName: "house.fill", title: "Profile saved", detail: "Ready for routing")
                        HomeStatusPill(iconName: "sparkles", title: "Next up", detail: "Service booking")
                    }

                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(services, id: \.0) { service in
                            VStack(alignment: .leading, spacing: 16) {
                                Image(systemName: service.1)
                                    .font(.system(size: 24, weight: .semibold))
                                    .foregroundStyle(.secondary)
                                    .frame(width: 54, height: 54)
                                    .background(Color(.tertiarySystemFill), in: RoundedRectangle(cornerRadius: 18, style: .continuous))

                                Text(service.0)
                                    .font(.system(size: 20, weight: .bold, design: .rounded))
                                    .foregroundStyle(.primary)
                                    .lineLimit(2)
                                    .minimumScaleFactor(0.82)

                                Spacer(minLength: 0)

                                Text("Coming soon")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundStyle(.secondary)
                            }
                            .frame(maxWidth: .infinity, minHeight: 164, alignment: .topLeading)
                            .padding(15)
                            .background(.white.opacity(0.78), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
                            .overlay {
                                RoundedRectangle(cornerRadius: 24, style: .continuous)
                                    .stroke(.white.opacity(0.9), lineWidth: 1)
                            }
                            .opacity(0.72)
                        }
                    }
                }
                .padding(.horizontal, 18)
                .padding(.bottom, 34)
            }
        }
    }
}

#Preview {
    DashboardPlaceholderView()
}
