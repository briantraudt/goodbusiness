import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var serviceStore: ServiceStore
    @State private var selectedService: HomeService?

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12)
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                HomeBackground()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 18) {
                        header
                        actionStrip

                        if let featuredService = serviceStore.services.first {
                            FeaturedServiceCard(service: featuredService) {
                                selectedService = featuredService
                            }
                            .padding(.top, 2)
                        }

                        sectionHeader

                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(serviceStore.services.dropFirst()) { service in
                                ServiceTile(service: service) {
                                    selectedService = service
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 20)
                    .padding(.bottom, 34)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .sheet(item: $selectedService) { service in
                ServiceRequestView(draft: ServiceRequestDraft(service: service))
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Good Business")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.secondary)

                    Text("Home")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundStyle(.primary)
                }

                Spacer()

                Button {
                } label: {
                    Image(systemName: "person.crop.circle")
                        .font(.system(size: 24, weight: .medium))
                        .foregroundStyle(.primary)
                        .frame(width: 42, height: 42)
                        .background(.white.opacity(0.78), in: Circle())
                        .overlay {
                            Circle()
                                .stroke(.white.opacity(0.9), lineWidth: 1)
                        }
                }
                .accessibilityLabel("Account")
            }

            VStack(alignment: .leading, spacing: 10) {
                Text("Get the house handled.")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .lineSpacing(-2)
                    .foregroundStyle(.primary)
                    .minimumScaleFactor(0.82)

                Text("Book trusted help for repairs, upkeep, and reset days.")
                    .font(.system(size: 17, weight: .regular))
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var actionStrip: some View {
        HStack(spacing: 10) {
            HomeStatusPill(iconName: "clock.badge.checkmark", title: "Fast match", detail: "Same-day options")
            HomeStatusPill(iconName: "checkmark.seal.fill", title: "Vetted pros", detail: "Insured partners")
        }
    }

    private var sectionHeader: some View {
        HStack {
            Text("Popular services")
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)

            Spacer()

            if serviceStore.isLoading {
                ProgressView()
                    .controlSize(.small)
            }
        }
    }
}

#Preview {
    HomeView()
        .environmentObject(ServiceStore())
}
