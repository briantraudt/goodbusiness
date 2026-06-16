import Foundation
import SwiftUI

struct HomeService: Identifiable, Decodable, Hashable {
    let slug: String
    let name: String
    let summary: String
    let iconName: String
    let accentHex: String
    let sortOrder: Int

    var id: String { slug }

    var accentColor: Color {
        Color(hex: accentHex) ?? .blue
    }

    enum CodingKeys: String, CodingKey {
        case slug
        case name
        case summary
        case iconName = "icon_name"
        case accentHex = "accent_hex"
        case sortOrder = "sort_order"
    }
}

extension HomeService {
    static let defaults: [HomeService] = [
        HomeService(slug: "plumbing", name: "Plumbing", summary: "Leaks, fixtures, drains, and water heaters", iconName: "wrench.and.screwdriver.fill", accentHex: "#2563EB", sortOrder: 1),
        HomeService(slug: "electrical", name: "Electrical", summary: "Outlets, panels, lighting, and safety fixes", iconName: "bolt.fill", accentHex: "#F59E0B", sortOrder: 2),
        HomeService(slug: "landscaping", name: "Landscaping", summary: "Lawn care, planting, cleanup, and outdoor work", iconName: "leaf.fill", accentHex: "#16A34A", sortOrder: 3),
        HomeService(slug: "painting", name: "Painting", summary: "Interior rooms, exterior refreshes, and touch-ups", iconName: "paintbrush.fill", accentHex: "#7C3AED", sortOrder: 4),
        HomeService(slug: "cleaning", name: "Cleaning", summary: "Standard, deep, move-in, and move-out cleaning", iconName: "sparkles", accentHex: "#0891B2", sortOrder: 5),
        HomeService(slug: "hvac", name: "HVAC", summary: "Heating, cooling, filters, repairs, and tune-ups", iconName: "fan.fill", accentHex: "#DC2626", sortOrder: 6)
    ]
}
