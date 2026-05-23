import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:resume_ai/core/theme/app_theme.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        title: const Text('Privacy Policy'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Privacy Policy',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              'Last updated: May 2026',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 24),
            _Section(
              title: '1. Information We Collect',
              body:
                  'We collect information you provide when creating an account (name, email address, password) and when building a resume (work history, education, skills, projects). We do not collect payment information.',
            ),
            _Section(
              title: '2. How We Use Your Information',
              body:
                  'Your resume data is used solely to generate, improve, and score resumes using AI. We send your resume content to OpenAI\'s API to provide AI-powered features. We do not sell your personal data to third parties.',
            ),
            _Section(
              title: '3. AI Processing',
              body:
                  'Resume content you enter is processed by OpenAI\'s GPT models to provide AI optimization features. This data is subject to OpenAI\'s privacy policy. We recommend not including highly sensitive personal information such as national ID numbers, financial details, or medical history in your resume.',
            ),
            _Section(
              title: '4. Data Storage',
              body:
                  'Your data is stored securely in an encrypted database. Authentication tokens are stored locally on your device using encrypted storage. Generated PDF files are stored on our servers and are accessible only to you via your authenticated account.',
            ),
            _Section(
              title: '5. Data Retention',
              body:
                  'Your account and resume data are retained as long as your account is active. You may delete your account and all associated data at any time by contacting us.',
            ),
            _Section(
              title: '6. Security',
              body:
                  'We use industry-standard security measures including bcrypt password hashing, JWT authentication, and HTTPS encryption for all data in transit. Despite these measures, no method of transmission over the internet is 100% secure.',
            ),
            _Section(
              title: '7. Children\'s Privacy',
              body:
                  'Resume AI is not directed at children under 13. We do not knowingly collect personal information from children under 13.',
            ),
            _Section(
              title: '8. Changes to This Policy',
              body:
                  'We may update this policy from time to time. We will notify you of significant changes by updating the date at the top of this page.',
            ),
            _Section(
              title: '9. Contact Us',
              body:
                  'If you have questions about this privacy policy or your data, contact us at: support@resumeai.app',
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final String body;
  const _Section({required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 15,
                color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 6),
          Text(
            body,
            style: const TextStyle(
                fontSize: 14, color: AppTheme.textSecondary, height: 1.6),
          ),
        ],
      ),
    );
  }
}
