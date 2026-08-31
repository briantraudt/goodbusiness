import SwiftUI

struct AppRootView: View {
    @EnvironmentObject private var onboardingStore: OnboardingStore

    var body: some View {
        Group {
            if onboardingStore.isOnboardingComplete {
                DashboardPlaceholderView()
                    .transition(.opacity.combined(with: .scale(scale: 0.98)))
            } else {
                OnboardingFlowView()
                    .transition(.opacity)
            }
        }
        .animation(.spring(response: 0.42, dampingFraction: 0.86), value: onboardingStore.isOnboardingComplete)
    }
}

#Preview {
    AppRootView()
        .environmentObject(OnboardingStore())
        .environmentObject(ServiceStore())
}
