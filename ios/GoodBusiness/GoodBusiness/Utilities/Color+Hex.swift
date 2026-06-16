import SwiftUI

extension Color {
    init?(hex: String) {
        var value = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if value.hasPrefix("#") {
            value.removeFirst()
        }

        guard value.count == 6, let number = UInt64(value, radix: 16) else {
            return nil
        }

        let red = Double((number & 0xFF0000) >> 16) / 255
        let green = Double((number & 0x00FF00) >> 8) / 255
        let blue = Double(number & 0x0000FF) / 255

        self.init(red: red, green: green, blue: blue)
    }
}
