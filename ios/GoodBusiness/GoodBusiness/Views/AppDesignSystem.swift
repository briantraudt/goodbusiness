import SwiftUI

enum AppPalette {
    static let canvas = Color(red: 0.953, green: 0.929, blue: 0.878)
    static let surface = Color(red: 0.988, green: 0.984, blue: 0.965)
    static let elevatedSurface = Color(red: 0.984, green: 0.973, blue: 0.945)
    static let surfaceLedge = Color(red: 0.902, green: 0.871, blue: 0.812)
    static let border = Color(red: 0.918, green: 0.89, blue: 0.831)
    static let dashed = Color(red: 0.812, green: 0.776, blue: 0.698)
    static let charcoal = Color(red: 0.137, green: 0.153, blue: 0.169)
    static let text = Color(red: 0.137, green: 0.149, blue: 0.165)
    static let secondaryText = Color(red: 0.541, green: 0.518, blue: 0.471)
    static let muted = Color(red: 0.604, green: 0.576, blue: 0.518)
    static let brand = Color(red: 0.184, green: 0.49, blue: 0.447)
    static let profileFill = Color(red: 0.871, green: 0.929, blue: 0.91)
    static let sage = Color(red: 0.373, green: 0.451, blue: 0.337)
    static let gold = Color(red: 0.71, green: 0.506, blue: 0.122)
    static let blueGray = Color(red: 0.35, green: 0.443, blue: 0.455)
    static let teal = Color(red: 0.184, green: 0.49, blue: 0.447)
    static let leaf = Color(red: 0.31, green: 0.45, blue: 0.337)
    static let stone = Color(red: 0.29, green: 0.271, blue: 0.231)
    static let error = Color(red: 0.72, green: 0.18, blue: 0.14)
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
