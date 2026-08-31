import SwiftUI

enum ServiceGlyphKind {
    case plumbing
    case electrical
    case hvac
    case appliance
    case lawn
    case handyman
}

extension HomeService {
    var specGlyphKind: ServiceGlyphKind {
        switch slug {
        case "plumbing": .plumbing
        case "electrical": .electrical
        case "hvac": .hvac
        case "appliance": .appliance
        case "landscaping", "lawn", "lawn-yard": .lawn
        default: .handyman
        }
    }

    var specAccentColor: Color {
        switch specGlyphKind {
        case .plumbing: AppPalette.sage
        case .electrical: AppPalette.gold
        case .hvac: AppPalette.blueGray
        case .appliance: AppPalette.teal
        case .lawn: AppPalette.leaf
        case .handyman: AppPalette.stone
        }
    }
}

struct ServiceIconBadge: View {
    let service: HomeService
    var size: CGFloat = 42
    var glyphSize: CGFloat = 22

    var body: some View {
        ServiceGlyph(kind: service.specGlyphKind, size: glyphSize)
            .foregroundStyle(service.specAccentColor)
            .frame(width: size, height: size)
            .background(service.specAccentColor.opacity(0.16), in: RoundedRectangle(cornerRadius: size * 0.31, style: .continuous))
    }
}

struct KeplyMark: View {
    var size: CGFloat = 46

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size * 0.25, style: .continuous)
                .fill(AppPalette.brand)

            Path { path in
                path.move(to: CGPoint(x: size * 0.23, y: size * 0.54))
                path.addLine(to: CGPoint(x: size * 0.5, y: size * 0.29))
                path.addLine(to: CGPoint(x: size * 0.77, y: size * 0.54))
            }
            .stroke(AppPalette.canvas, style: StrokeStyle(lineWidth: size * 0.076, lineCap: .round, lineJoin: .round))

            Circle()
                .fill(AppPalette.canvas)
                .frame(width: size * 0.15, height: size * 0.15)
                .offset(y: size * 0.14)
        }
        .frame(width: size, height: size)
    }
}

struct ServiceGlyph: View {
    let kind: ServiceGlyphKind
    var size: CGFloat = 22

    var body: some View {
        Canvas { context, canvasSize in
            let w = canvasSize.width
            let h = canvasSize.height
            let stroke = StrokeStyle(lineWidth: 1.8, lineCap: .round, lineJoin: .round)
            var path = Path()

            switch kind {
            case .plumbing:
                path.move(to: CGPoint(x: w * 0.68, y: h * 0.8))
                path.addLine(to: CGPoint(x: w * 0.68, y: h * 0.5))
                path.addQuadCurve(to: CGPoint(x: w * 0.48, y: h * 0.34), control: CGPoint(x: w * 0.68, y: h * 0.34))
                path.addLine(to: CGPoint(x: w * 0.3, y: h * 0.34))
                path.move(to: CGPoint(x: w * 0.3, y: h * 0.24))
                path.addLine(to: CGPoint(x: w * 0.3, y: h * 0.43))
                path.move(to: CGPoint(x: w * 0.56, y: h * 0.8))
                path.addLine(to: CGPoint(x: w * 0.79, y: h * 0.8))
                path.move(to: CGPoint(x: w * 0.68, y: h * 0.51))
                path.addLine(to: CGPoint(x: w * 0.84, y: h * 0.51))
                context.stroke(path, with: .foreground, style: stroke)

                var drop = Path()
                drop.move(to: CGPoint(x: w * 0.3, y: h * 0.57))
                drop.addQuadCurve(to: CGPoint(x: w * 0.23, y: h * 0.72), control: CGPoint(x: w * 0.18, y: h * 0.7))
                drop.addQuadCurve(to: CGPoint(x: w * 0.37, y: h * 0.72), control: CGPoint(x: w * 0.42, y: h * 0.7))
                drop.addQuadCurve(to: CGPoint(x: w * 0.3, y: h * 0.57), control: CGPoint(x: w * 0.31, y: h * 0.65))
                context.fill(drop, with: .foreground)

            case .electrical:
                path.addRoundedRect(in: CGRect(x: w * 0.2, y: h * 0.2, width: w * 0.6, height: h * 0.6), cornerSize: CGSize(width: w * 0.17, height: h * 0.17))
                path.move(to: CGPoint(x: w * 0.42, y: h * 0.38))
                path.addLine(to: CGPoint(x: w * 0.42, y: h * 0.52))
                path.move(to: CGPoint(x: w * 0.58, y: h * 0.38))
                path.addLine(to: CGPoint(x: w * 0.58, y: h * 0.52))
                context.stroke(path, with: .foreground, style: stroke)
                context.fill(Path(ellipseIn: CGRect(x: w * 0.455, y: h * 0.64, width: w * 0.09, height: h * 0.09)), with: .foreground)

            case .hvac:
                path.addRoundedRect(in: CGRect(x: w * 0.18, y: h * 0.26, width: w * 0.5, height: h * 0.52), cornerSize: CGSize(width: w * 0.11, height: h * 0.11))
                for y in [0.4, 0.52, 0.64] {
                    path.move(to: CGPoint(x: w * 0.3, y: h * y))
                    path.addLine(to: CGPoint(x: w * 0.56, y: h * y))
                }
                path.move(to: CGPoint(x: w * 0.8, y: h * 0.39))
                path.addQuadCurve(to: CGPoint(x: w * 0.8, y: h * 0.55), control: CGPoint(x: w * 0.94, y: h * 0.47))
                path.move(to: CGPoint(x: w * 0.8, y: h * 0.62))
                path.addQuadCurve(to: CGPoint(x: w * 0.8, y: h * 0.78), control: CGPoint(x: w * 0.94, y: h * 0.7))
                context.stroke(path, with: .foreground, style: stroke)

            case .appliance:
                path.addRoundedRect(in: CGRect(x: w * 0.26, y: h * 0.12, width: w * 0.48, height: h * 0.76), cornerSize: CGSize(width: w * 0.12, height: h * 0.12))
                path.move(to: CGPoint(x: w * 0.26, y: h * 0.43))
                path.addLine(to: CGPoint(x: w * 0.74, y: h * 0.43))
                path.move(to: CGPoint(x: w * 0.38, y: h * 0.24))
                path.addLine(to: CGPoint(x: w * 0.38, y: h * 0.33))
                path.move(to: CGPoint(x: w * 0.38, y: h * 0.54))
                path.addLine(to: CGPoint(x: w * 0.38, y: h * 0.68))
                context.stroke(path, with: .foreground, style: stroke)

            case .lawn:
                path.move(to: CGPoint(x: w * 0.16, y: h * 0.84))
                path.addLine(to: CGPoint(x: w * 0.84, y: h * 0.84))
                path.move(to: CGPoint(x: w * 0.32, y: h * 0.84))
                path.addQuadCurve(to: CGPoint(x: w * 0.38, y: h * 0.5), control: CGPoint(x: w * 0.28, y: h * 0.65))
                path.move(to: CGPoint(x: w * 0.5, y: h * 0.84))
                path.addQuadCurve(to: CGPoint(x: w * 0.52, y: h * 0.42), control: CGPoint(x: w * 0.5, y: h * 0.6))
                path.move(to: CGPoint(x: w * 0.68, y: h * 0.84))
                path.addQuadCurve(to: CGPoint(x: w * 0.62, y: h * 0.5), control: CGPoint(x: w * 0.72, y: h * 0.65))
                context.stroke(path, with: .foreground, style: stroke)

            case .handyman:
                path.addRoundedRect(in: CGRect(x: w * 0.18, y: h * 0.4, width: w * 0.64, height: h * 0.42), cornerSize: CGSize(width: w * 0.1, height: h * 0.1))
                path.move(to: CGPoint(x: w * 0.38, y: h * 0.4))
                path.addLine(to: CGPoint(x: w * 0.38, y: h * 0.31))
                path.addQuadCurve(to: CGPoint(x: w * 0.47, y: h * 0.22), control: CGPoint(x: w * 0.38, y: h * 0.22))
                path.addLine(to: CGPoint(x: w * 0.53, y: h * 0.22))
                path.addQuadCurve(to: CGPoint(x: w * 0.62, y: h * 0.31), control: CGPoint(x: w * 0.62, y: h * 0.22))
                path.addLine(to: CGPoint(x: w * 0.62, y: h * 0.4))
                path.move(to: CGPoint(x: w * 0.18, y: h * 0.58))
                path.addLine(to: CGPoint(x: w * 0.82, y: h * 0.58))
                context.stroke(path, with: .foreground, style: stroke)
                context.fill(Path(roundedRect: CGRect(x: w * 0.43, y: h * 0.5, width: w * 0.14, height: h * 0.15), cornerRadius: w * 0.035), with: .foreground)
            }
        }
        .frame(width: size, height: size)
    }
}
