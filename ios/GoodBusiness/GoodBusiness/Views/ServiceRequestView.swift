import SwiftUI

struct ServiceRequestView: View {
    @Environment(\.dismiss) private var dismiss
    @State var draft: ServiceRequestDraft
    @State private var step = 0
    @State private var didSubmit = false

    private let issues = ["Leak or drip", "Clogged drain", "No hot water", "Running toilet", "Low water pressure", "Something else"]
    private let rooms = ["Kitchen", "Bathroom", "Laundry", "Outside"]

    var body: some View {
        NavigationStack {
            ZStack {
                AppPalette.canvas
                    .ignoresSafeArea()

                if didSubmit {
                    RequestSubmittedView {
                        dismiss()
                    }
                } else {
                    VStack(spacing: 0) {
                        RequestFlowHeader(service: draft.service, title: headerTitle, closeAction: { dismiss() })
                            .padding(.top, 10)

                        if step < 4 {
                            RequestStepProgress(current: step + 1, count: 5)
                                .padding(.top, 12)
                        }

                        ScrollView(showsIndicators: false) {
                            VStack(alignment: .leading, spacing: 14) {
                                titleBlock

                                switch step {
                                case 0:
                                    issueSelection
                                case 1:
                                    describeAndPhotos
                                case 2:
                                    urgencyState
                                case 3:
                                    availability
                                default:
                                    review
                                }
                            }
                            .padding(.horizontal, 24)
                            .padding(.bottom, 18)
                        }

                        RequestPrimaryButton(title: step == 2 ? "I'm safe - continue" : step == 4 ? "Submit request" : "Continue") {
                            if step == 4 {
                                didSubmit = true
                            } else {
                                step += 1
                            }
                        }
                        .padding(.horizontal, 24)
                        .padding(.bottom, 26)
                    }
                }
            }
            .toolbar(.hidden, for: .navigationBar)
        }
    }

    private var headerTitle: String {
        if step == 0 {
            return draft.service.name
        }
        if step == 4 {
            return "Review request"
        }
        return "\(draft.service.name) · Leak"
    }

    private var titleBlock: some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(screenTitle)
                .font(.system(size: 26, weight: .bold))
                .tracking(-0.65)
                .foregroundStyle(AppPalette.text)

            if let subtitle = screenSubtitle {
                Text(subtitle)
                    .font(.system(size: 15, weight: .regular))
                    .lineSpacing(2)
                    .foregroundStyle(AppPalette.secondaryText)
            }
        }
        .padding(.top, 18)
        .padding(.bottom, 4)
    }

    private var screenTitle: String {
        switch step {
        case 0: "What's the issue?"
        case 1: "Tell us more"
        case 2: "How urgent is it?"
        case 3: "When works for you?"
        default: "Looks right?"
        }
    }

    private var screenSubtitle: String? {
        switch step {
        case 0: "Pick the closest - you can add detail next."
        case 1: "The more we know, the better the match."
        case 3: "Pick any windows - we'll match a pro to them."
        case 4: "Tap anything to edit before you send."
        default: nil
        }
    }

    private var issueSelection: some View {
        VStack(spacing: 9) {
            ForEach(Array(issues.enumerated()), id: \.offset) { index, issue in
                SelectableRequestRow(title: issue, isSelected: index == 0, showsChevron: issue == "Something else")
            }
        }
    }

    private var describeAndPhotos: some View {
        VStack(alignment: .leading, spacing: 15) {
            RequestLabel("Where in the home?")
            FlowLayout(spacing: 7) {
                ForEach(Array(rooms.enumerated()), id: \.offset) { index, room in
                    Text(room)
                        .font(.system(size: 13.5, weight: index == 0 ? .semibold : .medium))
                        .foregroundStyle(index == 0 ? Color(red: 0.988, green: 0.969, blue: 0.937) : AppPalette.secondaryText)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(index == 0 ? AppPalette.brand : AppPalette.surface, in: RoundedRectangle(cornerRadius: 11, style: .continuous))
                        .overlay {
                            RoundedRectangle(cornerRadius: 11, style: .continuous)
                                .stroke(index == 0 ? AppPalette.brand : AppPalette.border, lineWidth: 1)
                        }
                }
            }

            Text("Slow but steady drip from the pipe under the kitchen sink. Small puddle in the cabinet. Started two days ago.")
                .font(.system(size: 15.5, weight: .regular))
                .lineSpacing(2)
                .foregroundStyle(AppPalette.bodyText)
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .stroke(AppPalette.border, lineWidth: 1)
                }

            RequestLabel("Photos & video")
            HStack(spacing: 9) {
                PhotoThumb(colors: [Color(red: 0.78, green: 0.706, blue: 0.62), Color(red: 0.612, green: 0.541, blue: 0.455)])
                PhotoThumb(colors: [Color(red: 0.663, green: 0.69, blue: 0.627), Color(red: 0.475, green: 0.522, blue: 0.431)])
                DashedMediaButton(iconName: "plus", title: "Photo")
                DashedMediaButton(iconName: "video", title: "Video")
            }

            HStack(spacing: 8) {
                Image(systemName: "camera")
                    .font(.system(size: 15, weight: .medium))
                Text("Photos help us avoid a wasted trip.")
                    .font(.system(size: 13, weight: .semibold))
            }
            .foregroundStyle(AppPalette.sage)
        }
    }

    private var urgencyState: some View {
        VStack(spacing: 9) {
            SelectableRequestRow(title: "Emergency · Today", subtitle: "We'll prioritize routing right now", iconName: "bolt", isSelected: true)
            SelectableRequestRow(title: "Soon · 24-48 hrs", iconName: "clock", isSelected: false)
            SelectableRequestRow(title: "This week", iconName: "calendar", isSelected: false)

            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .top, spacing: 11) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(.white)
                        .frame(width: 30, height: 30)
                        .background(AppPalette.error, in: RoundedRectangle(cornerRadius: 9, style: .continuous))

                    VStack(alignment: .leading, spacing: 3) {
                        Text("Is water actively flooding?")
                            .font(.system(size: 14.5, weight: .bold))
                            .foregroundStyle(Color(red: 0.541, green: 0.2, blue: 0.141))
                        Text("Shut off your main valve first. If anyone's in danger or you smell gas, call 911 or your utility before booking.")
                            .font(.system(size: 13, weight: .regular))
                            .lineSpacing(2)
                            .foregroundStyle(Color(red: 0.482, green: 0.263, blue: 0.22))
                    }
                }

                HStack(spacing: 8) {
                    SafetyButton(title: "Call 911", filled: true)
                    SafetyButton(title: "How to shut off water", filled: false)
                }
            }
            .padding(14)
            .background(AppPalette.errorFill, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(Color(red: 0.906, green: 0.769, blue: 0.733), lineWidth: 1)
            }
            .padding(.top, 4)
        }
    }

    private var availability: some View {
        VStack(alignment: .leading, spacing: 18) {
            RequestLabel("Days")
            HStack(spacing: 8) {
                ForEach([("TODAY", "16"), ("TUE", "17"), ("WED", "18"), ("THU", "19"), ("FRI", "20")], id: \.1) { day in
                    VStack(spacing: 2) {
                        Text(day.0)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(day.1 == "16" ? .white.opacity(0.8) : AppPalette.muted)
                        Text(day.1)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundStyle(day.1 == "16" ? Color(red: 0.988, green: 0.969, blue: 0.937) : AppPalette.text)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 11)
                    .background(day.1 == "16" ? AppPalette.brand : AppPalette.surface, in: RoundedRectangle(cornerRadius: 13, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 13, style: .continuous)
                            .stroke(day.1 == "16" ? AppPalette.brand : AppPalette.border, lineWidth: 1)
                    }
                }
            }

            RequestLabel("Time window")
            VStack(spacing: 9) {
                SelectableRequestRow(title: "Morning", subtitle: "8:00 - 12:00", isSelected: true)
                SelectableRequestRow(title: "Afternoon", subtitle: "12:00 - 4:00", isSelected: true)
                SelectableRequestRow(title: "Evening", subtitle: "4:00 - 7:00", isSelected: false)
            }

            HStack(spacing: 13) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Let the pro in")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(AppPalette.text)
                    Text("Using saved access - Gate #4821, side gate")
                        .font(.system(size: 12.5, weight: .regular))
                        .foregroundStyle(AppPalette.muted)
                }
                Spacer()
                ToggleSwitch()
            }
            .padding(14)
            .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(AppPalette.border, lineWidth: 1)
            }
        }
    }

    private var review: some View {
        VStack(alignment: .leading, spacing: 10) {
            ReviewRequestCard()

            HStack(spacing: 8) {
                Image(systemName: "shield")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(AppPalette.sage)
                Text("Your details are reused automatically - no re-typing, ever.")
                    .font(.system(size: 12.5, weight: .regular))
                    .foregroundStyle(AppPalette.secondaryText)
            }
            .padding(.horizontal, 4)

            Text("We'll text updates to (415) 555-0148 - no phone-tag")
                .font(.system(size: 12.5, weight: .regular))
                .foregroundStyle(AppPalette.muted)
                .frame(maxWidth: .infinity)
                .padding(.top, 4)
        }
    }
}

private struct RequestFlowHeader: View {
    let service: HomeService
    let title: String
    let closeAction: () -> Void

    var body: some View {
        HStack {
            RequestIconButton(iconName: "chevron.left")
            Spacer()
            HStack(spacing: 8) {
                ServiceIconBadge(service: service, size: 24, glyphSize: 14)
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(AppPalette.text)
            }
            Spacer()
            Button(action: closeAction) {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(AppPalette.muted)
                    .frame(width: 36, height: 36)
                    .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 11, style: .continuous))
                    .overlay {
                        RoundedRectangle(cornerRadius: 11, style: .continuous)
                            .stroke(AppPalette.border, lineWidth: 1)
                    }
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 20)
    }
}

private struct RequestIconButton: View {
    let iconName: String

    var body: some View {
        Image(systemName: iconName)
            .font(.system(size: 15, weight: .semibold))
            .foregroundStyle(AppPalette.text)
            .frame(width: 36, height: 36)
            .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 11, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 11, style: .continuous)
                    .stroke(AppPalette.border, lineWidth: 1)
            }
    }
}

private struct RequestStepProgress: View {
    let current: Int
    let count: Int

    var body: some View {
        HStack(spacing: 5) {
            ForEach(1...count, id: \.self) { index in
                Capsule()
                    .fill(index <= current ? AppPalette.brand : AppPalette.progressTrack)
                    .frame(height: 3)
            }
        }
        .padding(.horizontal, 20)
    }
}

private struct SelectableRequestRow: View {
    var title: String
    var subtitle: String?
    var iconName: String?
    var isSelected: Bool
    var showsChevron = false

    var body: some View {
        HStack(spacing: 13) {
            if let iconName {
                Image(systemName: iconName)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(isSelected ? AppPalette.brand : AppPalette.muted)
                    .frame(width: 34, height: 34)
                    .background((isSelected ? AppPalette.brand.opacity(0.16) : AppPalette.elevatedSurface), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 16, weight: isSelected ? .semibold : .regular))
                    .foregroundStyle(isSelected ? AppPalette.text : showsChevron ? AppPalette.secondaryText : AppPalette.bodyText)
                if let subtitle {
                    Text(subtitle)
                        .font(.system(size: 12.5, weight: .regular))
                        .foregroundStyle(isSelected ? AppPalette.brandPressed : AppPalette.muted)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            if isSelected {
                Image(systemName: "checkmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 22, height: 22)
                    .background(AppPalette.brand, in: Circle())
            } else if showsChevron {
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(AppPalette.faintText)
            } else {
                Circle()
                    .stroke(Color(red: 0.839, green: 0.812, blue: 0.745), lineWidth: 1.5)
                    .frame(width: 21, height: 21)
            }
        }
        .padding(.horizontal, 15)
        .padding(.vertical, iconName == nil ? 14 : 13)
        .background(isSelected ? AppPalette.selectedFill : AppPalette.surface, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(isSelected ? AppPalette.brand : AppPalette.border, lineWidth: isSelected ? 1.5 : 1)
        }
    }
}

private struct RequestLabel: View {
    let title: String

    init(_ title: String) {
        self.title = title
    }

    var body: some View {
        Text(title)
            .font(.system(size: 11, weight: .semibold))
            .textCase(.uppercase)
            .tracking(0.55)
            .foregroundStyle(AppPalette.muted)
            .padding(.horizontal, 2)
    }
}

private struct PhotoThumb: View {
    let colors: [Color]

    var body: some View {
        LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
            .frame(width: 70, height: 70)
            .clipShape(RoundedRectangle(cornerRadius: 13, style: .continuous))
    }
}

private struct DashedMediaButton: View {
    let iconName: String
    let title: String

    var body: some View {
        VStack(spacing: 3) {
            Image(systemName: iconName)
                .font(.system(size: 18, weight: .medium))
            Text(title)
                .font(.system(size: 10, weight: .semibold))
        }
        .foregroundStyle(AppPalette.muted)
        .frame(width: 70, height: 70)
        .overlay {
            RoundedRectangle(cornerRadius: 13, style: .continuous)
                .stroke(AppPalette.dashed, style: StrokeStyle(lineWidth: 1.5, dash: [4, 3]))
        }
    }
}

private struct SafetyButton: View {
    let title: String
    let filled: Bool

    var body: some View {
        Text(title)
            .font(.system(size: 13.5, weight: .bold))
            .foregroundStyle(filled ? .white : Color(red: 0.541, green: 0.2, blue: 0.141))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 11)
            .background(filled ? AppPalette.error : AppPalette.surface, in: RoundedRectangle(cornerRadius: 11, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 11, style: .continuous)
                    .stroke(filled ? AppPalette.error : Color(red: 0.906, green: 0.769, blue: 0.733), lineWidth: 1)
            }
    }
}

private struct ToggleSwitch: View {
    var body: some View {
        HStack {
            Spacer()
            Circle()
                .fill(.white)
                .frame(width: 23, height: 23)
                .shadow(color: .black.opacity(0.25), radius: 3, x: 0, y: 1)
        }
        .padding(3)
        .frame(width: 48, height: 29)
        .background(AppPalette.sage, in: Capsule())
    }
}

private struct RequestPrimaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(Color(red: 0.988, green: 0.969, blue: 0.937))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 17)
                .background(AppPalette.brand, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .shadow(color: AppPalette.brand.opacity(0.36), radius: 22, x: 0, y: 10)
        }
        .buttonStyle(.plain)
    }
}

private struct ReviewRequestCard: View {
    var body: some View {
        VStack(spacing: 0) {
            ReviewRequestRow(label: "Service", value: "Plumbing · Leak or drip", icon: AnyView(ServiceGlyph(kind: .plumbing, size: 18).foregroundStyle(AppPalette.sage)))
            ReviewRequestRow(label: "Details", value: "Drip under kitchen sink, puddle in cabinet...", trailing: AnyView(HStack(spacing: 5) {
                PhotoThumb(colors: [Color(red: 0.78, green: 0.706, blue: 0.62), Color(red: 0.612, green: 0.541, blue: 0.455)]).frame(width: 34, height: 34)
                PhotoThumb(colors: [Color(red: 0.663, green: 0.69, blue: 0.627), Color(red: 0.475, green: 0.522, blue: 0.431)]).frame(width: 34, height: 34)
            }))
            ReviewRequestRow(label: "Urgency", value: "Emergency · Today", showsEdit: true)
            ReviewRequestRow(label: "Availability", value: "Today · Morning & Afternoon", showsEdit: true)
            ReviewRequestRow(label: "Home & access", value: "1840 Linden Ave · Saved notes", badge: "On file", isLast: true)
        }
        .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(AppPalette.border, lineWidth: 1)
        }
    }
}

private struct ReviewRequestRow: View {
    let label: String
    let value: String
    var icon: AnyView?
    var trailing: AnyView?
    var showsEdit = false
    var badge: String?
    var isLast = false

    var body: some View {
        HStack(spacing: 12) {
            if let icon {
                icon
                    .frame(width: 34, height: 34)
                    .background(AppPalette.sage.opacity(0.16), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(label)
                    .font(.system(size: 11, weight: .semibold))
                    .textCase(.uppercase)
                    .tracking(0.44)
                    .foregroundStyle(AppPalette.muted)
                Text(value)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(AppPalette.text)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            if let trailing {
                trailing
            } else if showsEdit {
                Text("Edit")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(AppPalette.brand)
            } else if let badge {
                Text(badge)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(AppPalette.sage)
                    .padding(.horizontal, 9)
                    .padding(.vertical, 4)
                    .background(AppPalette.sage.opacity(0.13), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 13)
        .overlay(alignment: .bottom) {
            if isLast == false {
                Rectangle()
                    .fill(AppPalette.subtleLine)
                    .frame(height: 1)
            }
        }
    }
}

private struct RequestSubmittedView: View {
    let done: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 0)
            VStack(spacing: 10) {
                Image(systemName: "checkmark")
                    .font(.system(size: 35, weight: .bold))
                    .foregroundStyle(AppPalette.canvas)
                    .frame(width: 78, height: 78)
                    .background(AppPalette.sage, in: Circle())
                    .shadow(color: AppPalette.sage.opacity(0.42), radius: 30, x: 0, y: 14)

                Text("Request received")
                    .font(.system(size: 28, weight: .bold))
                    .tracking(-0.84)
                    .foregroundStyle(AppPalette.text)
                    .padding(.top, 12)

                Text("A coordinator is matching you with a vetted plumber now. Sit tight - we'll handle it.")
                    .font(.system(size: 15.5, weight: .regular))
                    .lineSpacing(2)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(AppPalette.secondaryText)
                    .frame(maxWidth: 290)

                Text("REQUEST #KP-2048")
                    .font(.system(size: 12.5, weight: .bold))
                    .tracking(0.75)
                    .foregroundStyle(AppPalette.muted)
                    .padding(.horizontal, 13)
                    .padding(.vertical, 6)
                    .background(AppPalette.surface, in: Capsule())
                    .overlay {
                        Capsule()
                            .stroke(AppPalette.border, lineWidth: 1)
                    }
                    .padding(.top, 4)
            }

            StatusTimeline()
                .padding(20)
                .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .stroke(AppPalette.border, lineWidth: 1)
                }
                .padding(.top, 24)

            Spacer(minLength: 0)

            RequestPrimaryButton(title: "Track request", action: done)
            Button("Back to home", action: done)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(AppPalette.secondaryText)
                .padding(.top, 12)
        }
        .padding(.horizontal, 26)
        .padding(.bottom, 26)
        .background(
            RadialGradient(
                colors: [Color(red: 0.933, green: 0.945, blue: 0.902), AppPalette.canvas],
                center: .top,
                startRadius: 20,
                endRadius: 440
            )
            .ignoresSafeArea()
        )
    }
}

private struct StatusTimeline: View {
    private let rows = [
        ("Submitted", "Just now", AppPalette.sage, true),
        ("Reviewing", "Happening now...", AppPalette.gold, true),
        ("Matching provider", "", AppPalette.faintText, false),
        ("Scheduled", "", AppPalette.faintText, false)
    ]

    var body: some View {
        VStack(spacing: 0) {
            ForEach(Array(rows.enumerated()), id: \.offset) { index, row in
                HStack(alignment: .top, spacing: 14) {
                    VStack(spacing: 0) {
                        Circle()
                            .fill(row.3 ? row.2 : AppPalette.surface)
                            .overlay {
                                Circle()
                                    .stroke(row.3 ? row.2 : Color(red: 0.839, green: 0.812, blue: 0.745), lineWidth: 2)
                            }
                            .frame(width: 26, height: 26)
                            .overlay {
                                if index == 0 {
                                    Image(systemName: "checkmark")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundStyle(.white)
                                } else if index == 1 {
                                    Circle()
                                        .fill(.white)
                                        .frame(width: 8, height: 8)
                                }
                            }
                        if index < rows.count - 1 {
                            Rectangle()
                                .fill(index == 0 ? AppPalette.sage : AppPalette.progressTrack)
                                .frame(width: 2, height: 26)
                        }
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text(row.0)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(row.3 ? AppPalette.text : AppPalette.faintText)
                        if row.1.isEmpty == false {
                            Text(row.1)
                                .font(.system(size: 12.5, weight: .regular))
                                .foregroundStyle(row.2)
                        }
                    }
                    .padding(.bottom, index < rows.count - 1 ? 18 : 0)
                    Spacer()
                }
            }
        }
    }
}

#Preview {
    ServiceRequestView(draft: ServiceRequestDraft(service: HomeService.defaults[0]))
}
