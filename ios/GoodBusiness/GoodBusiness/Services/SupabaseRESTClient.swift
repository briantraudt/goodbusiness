import Foundation

enum SupabaseConfiguration {
    static let url = Bundle.main.object(forInfoDictionaryKey: "SUPABASE_URL") as? String ?? ""
    static let anonKey = Bundle.main.object(forInfoDictionaryKey: "SUPABASE_ANON_KEY") as? String ?? ""

    static var isConfigured: Bool {
        guard let parsedURL = URL(string: url), parsedURL.scheme?.hasPrefix("http") == true else {
            return false
        }

        return anonKey != "replace-with-good-business-anon-key" && anonKey.isEmpty == false
    }
}

struct SupabaseRESTClient {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchServices() async throws -> [HomeService] {
        guard SupabaseConfiguration.isConfigured else {
            return HomeService.defaults
        }

        var components = URLComponents(string: "\(SupabaseConfiguration.url)/rest/v1/home_service_categories")
        components?.queryItems = [
            URLQueryItem(name: "select", value: "slug,name,summary,icon_name,accent_hex,sort_order"),
            URLQueryItem(name: "is_active", value: "eq.true"),
            URLQueryItem(name: "order", value: "sort_order.asc")
        ]

        guard let url = components?.url else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.setValue(SupabaseConfiguration.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(SupabaseConfiguration.anonKey)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await session.data(for: request)
        try validate(response: response, data: data)
        return try JSONDecoder().decode([HomeService].self, from: data)
    }

    private func validate(response: URLResponse, data: Data) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }

        guard 200..<300 ~= httpResponse.statusCode else {
            let message = String(data: data, encoding: .utf8) ?? "HTTP \(httpResponse.statusCode)"
            throw SupabaseRESTError.requestFailed(message)
        }
    }
}

enum SupabaseRESTError: LocalizedError {
    case requestFailed(String)

    var errorDescription: String? {
        switch self {
        case .requestFailed(let message):
            return message
        }
    }
}
