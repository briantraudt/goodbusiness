import SwiftUI

struct ServiceRequestView: View {
    @Environment(\.dismiss) private var dismiss
    @State var draft: ServiceRequestDraft
    @State private var didSaveDraft = false

    private let windows = ["Anytime", "Morning", "Afternoon", "Evening"]
    private let quickNotes = ["Leak or damage", "Quote first", "ASAP", "Recurring help"]

    private var canStart: Bool {
        draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty == false
    }

    var body: some View {
        NavigationStack {
            ZStack {
                RequestBackground(color: draft.service.accentColor)

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 18) {
                        sheetHeader
                        requestCard
                        locationCard
                        timingCard
                        primaryButton
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 18)
                    .padding(.bottom, 28)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    closeButton
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

    private var sheetHeader: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack {
                ZStack {
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .fill(draft.service.accentColor.opacity(0.16))

                    Image(systemName: draft.service.iconName)
                        .font(.system(size: 32, weight: .bold))
                        .foregroundStyle(draft.service.accentColor)
                }
                .frame(width: 72, height: 72)

                Spacer()

                closeButton
            }

            VStack(alignment: .leading, spacing: 8) {
                Text(draft.service.name)
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)

                Text(draft.service.summary)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
        }
    }

    private var closeButton: some View {
        Button {
            dismiss()
        } label: {
            Image(systemName: "xmark")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(.primary)
                .frame(width: 34, height: 34)
                .background(.white.opacity(0.85), in: Circle())
        }
        .accessibilityLabel("Close")
    }

    private var requestCard: some View {
        RequestSurface(title: "Describe it", iconName: "text.bubble.fill", color: draft.service.accentColor) {
            VStack(spacing: 12) {
                RequestField(title: "Short title", text: $draft.title, prompt: "Kitchen sink leak")

                VStack(alignment: .leading, spacing: 8) {
                    Text("Details")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(.secondary)

                    TextField("Anything the pro should know?", text: $draft.description, axis: .vertical)
                        .font(.system(size: 16, weight: .medium))
                        .lineLimit(4...7)
                        .padding(14)
                        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                }

                FlexibleTagRow(tags: quickNotes, accentColor: draft.service.accentColor) { note in
                    if draft.description.isEmpty {
                        draft.description = note
                    } else if draft.description.contains(note) == false {
                        draft.description += ", \(note.lowercased())"
                    }
                }
            }
        }
    }

    private var locationCard: some View {
        RequestSurface(title: "Where", iconName: "location.fill", color: draft.service.accentColor) {
            VStack(spacing: 12) {
                RequestField(title: "Street address", text: $draft.addressLine1, prompt: "123 Main St")

                HStack(spacing: 10) {
                    RequestField(title: "City", text: $draft.city, prompt: "Austin")
                    RequestField(title: "State", text: $draft.state, prompt: "TX", width: 78)
                }

                RequestField(title: "ZIP code", text: $draft.postalCode, prompt: "78701", keyboardType: .numberPad)
            }
        }
    }

    private var timingCard: some View {
        RequestSurface(title: "When", iconName: "calendar.badge.clock", color: draft.service.accentColor) {
            VStack(spacing: 14) {
                DatePicker("Preferred date", selection: $draft.preferredDate, displayedComponents: .date)
                    .font(.system(size: 16, weight: .semibold))

                Picker("Time window", selection: $draft.preferredTimeWindow) {
                    ForEach(windows, id: \.self) { window in
                        Text(window).tag(window)
                    }
                }
                .pickerStyle(.segmented)
            }
        }
    }

    private var primaryButton: some View {
        Button {
            didSaveDraft = true
        } label: {
            HStack {
                Text("Start Request")
                    .font(.system(size: 17, weight: .bold))

                Image(systemName: "arrow.right")
                    .font(.system(size: 15, weight: .bold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 17)
            .background(canStart ? draft.service.accentColor : Color(.systemGray3), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .shadow(color: canStart ? draft.service.accentColor.opacity(0.26) : .clear, radius: 18, x: 0, y: 10)
        }
        .disabled(canStart == false)
        .padding(.top, 4)
    }
}

#Preview {
    ServiceRequestView(draft: ServiceRequestDraft(service: HomeService.defaults[0]))
}
