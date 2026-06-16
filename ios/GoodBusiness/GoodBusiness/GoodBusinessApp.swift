import SwiftUI

@main
struct GoodBusinessApp: App {
    @StateObject private var serviceStore = ServiceStore()
    @StateObject private var onboardingStore = OnboardingStore()

    var body: some Scene {
        WindowGroup {
            AppRootView()
                .environmentObject(serviceStore)
                .environmentObject(onboardingStore)
                .task {
                    await serviceStore.loadServices()
                }
        }
    }
}
