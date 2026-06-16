import SwiftUI

@main
struct GoodBusinessApp: App {
    @StateObject private var serviceStore = ServiceStore()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(serviceStore)
                .task {
                    await serviceStore.loadServices()
                }
        }
    }
}
