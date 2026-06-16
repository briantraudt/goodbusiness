import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var serviceStore: ServiceStore
    @State private var selectedService: HomeService?

    private let columns = [
        GridItem(.flexible(), spacing: 14),
        GridItem(.flexible(), spacing: 14)
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header

                    LazyVGrid(columns: columns, spacing: 14) {
                        ForEach(serviceStore.services) { service in
                            Button {
                                selectedService = service
                            } label: {
                                ServiceTile(service: service)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(20)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Good Business")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(item: $selectedService) { service in
                ServiceRequestView(draft: ServiceRequestDraft(service: service))
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("What do you need done?")
                .font(.system(size: 34, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)

            Text("Choose a service and start a request.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 10)
    }
}

#Preview {
    HomeView()
        .environmentObject(ServiceStore())
}
