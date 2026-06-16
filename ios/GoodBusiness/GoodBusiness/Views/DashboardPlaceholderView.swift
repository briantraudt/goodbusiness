import SwiftUI

struct DashboardPlaceholderView: View {
    @EnvironmentObject private var onboardingStore: OnboardingStore
    @State private var selectedService: DashboardService?

    private let services: [DashboardService] = [
        DashboardService(title: "Plumbing", subtitle: "Leaks, drains, water", kind: .plumbing, color: AppPalette.sage),
        DashboardService(title: "Electrical", subtitle: "Outlets, lights, panel", kind: .electrical, color: AppPalette.gold),
        DashboardService(title: "HVAC", subtitle: "Heating & cooling", kind: .hvac, color: AppPalette.blueGray),
        DashboardService(title: "Appliance", subtitle: "Fridge, washer, oven", kind: .appliance, color: AppPalette.teal),
        DashboardService(title: "Lawn / Yard", subtitle: "Mowing, cleanup", kind: .lawn, color: AppPalette.leaf),
        DashboardService(title: "Handyman", subtitle: "Repairs & mounting", kind: .handyman, color: AppPalette.stone)
    ]

    private let columns = [
        GridItem(.flexible(), spacing: 11),
        GridItem(.flexible(), spacing: 11)
    ]

    var body: some View {
        ZStack {
            AppPalette.canvas
                .ignoresSafeArea()

            VStack(spacing: 0) {
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        header
                            .padding(.top, 18)
                            .padding(.bottom, 13)

                        CalmStatusCard()
                            .padding(.bottom, 18)

                        Text("What needs fixing?")
                            .font(.system(size: 12, weight: .bold))
                            .textCase(.uppercase)
                            .tracking(0.8)
                            .foregroundStyle(AppPalette.muted)
                            .padding(.bottom, 10)

                        LazyVGrid(columns: columns, spacing: 11) {
                            ForEach(services) { service in
                                DashboardServiceTile(service: service) {
                                    selectedService = service
                                }
                            }
                        }

                        DescribeItButton()
                            .padding(.top, 14)
                    }
                    .padding(.horizontal, 22)
                    .padding(.bottom, 18)
                }

                DashboardTabBar()
            }
        }
        .sheet(item: $selectedService) { service in
            DashboardServicePreview(service: service)
                .presentationDetents([.medium])
                .presentationDragIndicator(.visible)
        }
    }

    private var header: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 1) {
                Text(greeting)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)

                Text("Your home")
                    .font(.system(size: 21, weight: .bold))
                    .tracking(-0.4)
                    .foregroundStyle(AppPalette.text)
            }

            Spacer()

            Text(initials)
                .font(.system(size: 15, weight: .bold))
                .foregroundStyle(AppPalette.brand)
                .frame(width: 42, height: 42)
                .background(AppPalette.profileFill, in: Circle())
        }
    }

    private var greeting: String {
        let firstName = onboardingStore.userProfile?.firstName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let firstName, firstName.isEmpty == false else {
            return "Good morning"
        }

        return "Good morning, \(firstName)"
    }

    private var initials: String {
        guard let profile = onboardingStore.userProfile else {
            return "GB"
        }

        let first = profile.firstName.first.map(String.init) ?? ""
        let last = profile.lastName.first.map(String.init) ?? ""
        let value = "\(first)\(last)"
        return value.isEmpty ? "GB" : value.uppercased()
    }
}

private struct DashboardService: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let kind: ServiceGlyphKind
    let color: Color
}

private struct CalmStatusCard: View {
    var body: some View {
        Button {
        } label: {
            HStack(spacing: 14) {
                Circle()
                    .fill(AppPalette.calmPulse)
                    .frame(width: 11, height: 11)
                    .overlay {
                        Circle()
                            .stroke(AppPalette.calmPulse.opacity(0.22), lineWidth: 10)
                    }
                    .padding(.horizontal, 5)

                VStack(alignment: .leading, spacing: 2) {
                    Text("All calm at home")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(Color(red: 0.945, green: 0.941, blue: 0.914))

                    Text("No active requests · Last: water heater flush, Apr")
                        .font(.system(size: 12.5, weight: .medium))
                        .foregroundStyle(AppPalette.muted)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)
                }

                Spacer(minLength: 8)

                Image(systemName: "chevron.right")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Color(red: 0.945, green: 0.941, blue: 0.914).opacity(0.48))
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppPalette.charcoal, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

private struct DashboardServiceTile: View {
    let service: DashboardService
    let action: () -> Void
    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 11) {
                ServiceGlyph(kind: service.kind, size: 22)
                    .foregroundStyle(service.color)
                    .frame(width: 42, height: 42)
                    .background(service.color.opacity(0.14), in: RoundedRectangle(cornerRadius: 13, style: .continuous))

                VStack(alignment: .leading, spacing: 1) {
                    Text(service.title)
                        .font(.system(size: 16, weight: .semibold))
                        .tracking(-0.2)
                        .foregroundStyle(AppPalette.text)
                        .lineLimit(2)
                        .minimumScaleFactor(0.78)

                    Text(service.subtitle)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(AppPalette.secondaryText)
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }

                Spacer(minLength: 0)
            }
            .frame(maxWidth: .infinity, minHeight: 118, alignment: .topLeading)
            .padding(15)
            .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .stroke(AppPalette.border, lineWidth: 1)
            }
            .shadow(color: AppPalette.surfaceLedge, radius: 0, x: 0, y: isPressed ? 1 : 2)
            .shadow(color: Color(red: 0.157, green: 0.141, blue: 0.118).opacity(isPressed ? 0.12 : 0.22), radius: isPressed ? 9 : 16, x: 0, y: isPressed ? 5 : 7)
            .offset(y: isPressed ? 1 : 0)
            .animation(.spring(response: 0.22, dampingFraction: 0.78), value: isPressed)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }
}

private struct DescribeItButton: View {
    var body: some View {
        Button {
        } label: {
            HStack(spacing: 11) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)

                Text("Not sure what it is? ")
                    .font(.system(size: 14.5, weight: .medium))
                    .foregroundStyle(Color(red: 0.431, green: 0.408, blue: 0.357))
                + Text("Describe it")
                    .font(.system(size: 14.5, weight: .semibold))
                    .foregroundStyle(AppPalette.text)
            }
            .lineLimit(1)
            .minimumScaleFactor(0.82)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color(red: 0.937, green: 0.914, blue: 0.863), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(AppPalette.dashed, style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
            }
        }
        .buttonStyle(.plain)
    }
}

private struct DashboardTabBar: View {
    var body: some View {
        HStack {
            TabItem(iconName: "house", title: "Home", isActive: true)
            Spacer()
            TabItem(iconName: "clock", title: "Activity", isActive: false)
            Spacer()
            TabItem(iconName: "person", title: "Profile", isActive: false)
        }
        .padding(.horizontal, 56)
        .padding(.top, 8)
        .padding(.bottom, 6)
        .background(Color(red: 0.984, green: 0.973, blue: 0.945))
        .overlay(alignment: .top) {
            Rectangle()
                .fill(Color(red: 0.906, green: 0.878, blue: 0.82))
                .frame(height: 1)
        }
    }
}

private struct TabItem: View {
    let iconName: String
    let title: String
    let isActive: Bool

    var body: some View {
        VStack(spacing: 3) {
            Image(systemName: iconName)
                .font(.system(size: 21, weight: .medium))

            Text(title)
                .font(.system(size: 10.5, weight: isActive ? .semibold : .medium))
        }
        .foregroundStyle(isActive ? AppPalette.brand : Color(red: 0.659, green: 0.631, blue: 0.573))
        .frame(width: 62)
    }
}

private struct DashboardServicePreview: View {
    let service: DashboardService
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(alignment: .leading, spacing: 22) {
            HStack(alignment: .top) {
                ServiceGlyph(kind: service.kind, size: 32)
                    .foregroundStyle(service.color)
                    .frame(width: 64, height: 64)
                    .background(service.color.opacity(0.14), in: RoundedRectangle(cornerRadius: 20, style: .continuous))

                Spacer()

                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(AppPalette.text)
                        .frame(width: 34, height: 34)
                        .background(.white.opacity(0.8), in: Circle())
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                Text(service.title)
                    .font(.system(size: 34, weight: .bold, design: .rounded))
                    .foregroundStyle(AppPalette.text)

                Text("This button will start a guided \(service.title.lowercased()) request using your saved home profile.")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(AppPalette.secondaryText)
                    .lineSpacing(2)
            }

            Button {
                dismiss()
            } label: {
                Text("Done")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AppPalette.charcoal, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            }

            Spacer()
        }
        .padding(22)
        .background(AppPalette.canvas)
    }
}

#Preview {
    DashboardPlaceholderView()
        .environmentObject(OnboardingStore())
}
