export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pt-[var(--safe-area-top)]">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">When you use KopiMap, we collect:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Account information (username, email)</li>
          <li>Reviews and ratings you submit</li>
          <li>Photos you upload with reviews</li>
          <li>Location data when searching for cafes</li>
          <li>Usage data and interaction with the platform</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use your information to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Display your reviews and contributions</li>
          <li>Improve our cafe recommendations</li>
          <li>Maintain and improve the platform</li>
          <li>Communicate updates and relevant information</li>
          <li>Ensure platform security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
        <p className="mb-4">
          Your public contributions (reviews, ratings, photos) are visible to other users.
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">
          We implement security measures to protect your information. However, no internet
          transmission is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access your personal information</li>
          <li>Update or correct your information</li>
          <li>Delete your account and associated data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
        <p className="mb-4">
          We use cookies to improve your experience. You can control cookie settings
          through your browser preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Changes to Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy. We will notify users of significant changes
          via email or platform notifications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
        <p className="mb-4">
          For privacy-related questions or concerns, please contact us at{" "}
          <a href="mailto:privacy@kopimap.com" className="text-blue-600 hover:underline">
            privacy@kopimap.com
          </a>
        </p>
      </section>

      <footer className="text-sm text-gray-600">
        Last updated: {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
