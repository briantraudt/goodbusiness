import SwiftUI

struct ServiceRequestView: View {
    @Environment(\.dismiss) private var dismiss
    @State var draft: ServiceRequestDraft
    @State private var didSaveDraft = false

    private let windows = ["Anytime", "Morning", "Afternoon", "Evening"]

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack(spacing: 12) {
                        Image(systemName: draft.service.iconName)
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundStyle(draft.service.accentColor)
                            .frame(width: 44, height: 44)
                            .background(draft.service.accentColor.opacity(0.14))
                            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))

                        VStack(alignment: .leading, spacing: 3) {
                            Text(draft.service.name)
                                .font(.headline)
                            Text(draft.service.summary)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }

                Section("Request") {
                    TextField("Short title", text: $draft.title)
                    TextField("Tell us what is going on", text: $draft.description, axis: .vertical)
                        .lineLimit(3...6)
                }

                Section("Location") {
                    TextField("Street address", text: $draft.addressLine1)
                    HStack {
                        TextField("City", text: $draft.city)
                        TextField("State", text: $draft.state)
                            .frame(width: 64)
                    }
                    TextField("ZIP code", text: $draft.postalCode)
                        .keyboardType(.numberPad)
                }

                Section("Timing") {
                    DatePicker("Preferred date", selection: $draft.preferredDate, displayedComponents: .date)
                    Picker("Window", selection: $draft.preferredTimeWindow) {
                        ForEach(windows, id: \.self) { window in
                            Text(window).tag(window)
                        }
                    }
                }

                Section {
                    Button {
                        didSaveDraft = true
                    } label: {
                        Text("Start Request")
                            .frame(maxWidth: .infinity)
                    }
                    .disabled(draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .navigationTitle("New Request")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
            .alert("Request draft ready", isPresented: $didSaveDraft) {
                Button("Done") {
                    dismiss()
                }
            } message: {
                Text("Authentication is the next step before this submits to Supabase.")
            }
        }
    }
}

#Preview {
    ServiceRequestView(draft: ServiceRequestDraft(service: HomeService.defaults[0]))
}
