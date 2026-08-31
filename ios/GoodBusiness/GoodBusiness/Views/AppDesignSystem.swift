import SwiftUI

enum AppPalette {
    static let canvas = Color(red: 0.945, green: 0.941, blue: 0.914) // #F1F0E9
    static let surface = Color(red: 0.988, green: 0.984, blue: 0.965) // #FCFBF6
    static let elevatedSurface = Color(red: 0.933, green: 0.902, blue: 0.851) // #EEE6D9
    static let surfaceLedge = Color(red: 0.902, green: 0.871, blue: 0.812) // #E6DECF
    static let border = Color(red: 0.922, green: 0.898, blue: 0.847) // #EBE5D8
    static let subtleLine = Color(red: 0.941, green: 0.922, blue: 0.875) // #F0EBDF
    static let progressTrack = Color(red: 0.886, green: 0.863, blue: 0.812) // #E2DCCF
    static let dashed = Color(red: 0.812, green: 0.776, blue: 0.698) // #CFC6B2
    static let charcoal = Color(red: 0.137, green: 0.153, blue: 0.169) // #23272B
    static let text = Color(red: 0.137, green: 0.149, blue: 0.165) // #23262A
    static let bodyText = Color(red: 0.224, green: 0.239, blue: 0.251) // #393D40
    static let secondaryText = Color(red: 0.431, green: 0.408, blue: 0.357) // #6E685B
    static let muted = Color(red: 0.604, green: 0.576, blue: 0.518) // #9A9384
    static let faintText = Color(red: 0.659, green: 0.631, blue: 0.573) // #A8A192
    static let brand = Color(red: 0.184, green: 0.49, blue: 0.447) // #2F7D72
    static let brandPressed = Color(red: 0.141, green: 0.361, blue: 0.325) // #245C53
    static let profileFill = Color(red: 0.871, green: 0.929, blue: 0.91) // #DEEDE8
    static let selectedFill = Color(red: 0.902, green: 0.945, blue: 0.933) // #E6F1EE
    static let sage = Color(red: 0.373, green: 0.451, blue: 0.337) // #5F7356
    static let calmPulse = Color(red: 0.494, green: 0.604, blue: 0.431) // #7E9A6E
    static let gold = Color(red: 0.757, green: 0.541, blue: 0.18) // #C18A2E
    static let blueGray = Color(red: 0.369, green: 0.447, blue: 0.42) // #5E726B
    static let teal = Color(red: 0.184, green: 0.49, blue: 0.447)
    static let leaf = Color(red: 0.243, green: 0.361, blue: 0.227) // #3E5C3A
    static let stone = Color(red: 0.29, green: 0.271, blue: 0.231) // #4A453B
    static let error = Color(red: 0.62, green: 0.231, blue: 0.18) // #9E3B2E
    static let errorFill = Color(red: 0.984, green: 0.918, blue: 0.898) // #FBEAE5
}

struct AppTactileSurface: ViewModifier {
    var cornerRadius: CGFloat = 20
    var isPressed = false

    func body(content: Content) -> some View {
        content
            .background(AppPalette.surface, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(AppPalette.border, lineWidth: 1)
            }
            .shadow(color: AppPalette.surfaceLedge, radius: 0, x: 0, y: isPressed ? 1 : 2)
            .shadow(color: Color(red: 0.157, green: 0.141, blue: 0.118).opacity(isPressed ? 0.1 : 0.18), radius: isPressed ? 8 : 14, x: 0, y: isPressed ? 4 : 7)
            .offset(y: isPressed ? 1 : 0)
    }
}

extension View {
    func appTactileSurface(cornerRadius: CGFloat = 20, isPressed: Bool = false) -> some View {
        modifier(AppTactileSurface(cornerRadius: cornerRadius, isPressed: isPressed))
    }
}
