import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/presentation/state/subscription_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';

class UpgradeScreen extends ConsumerStatefulWidget {
  const UpgradeScreen({super.key});

  @override
  ConsumerState<UpgradeScreen> createState() => _UpgradeScreenState();
}

class _UpgradeScreenState extends ConsumerState<UpgradeScreen> {
  bool _isLoading = false;

  Future<void> _purchase() async {
    setState(() => _isLoading = true);
    try {
      final started =
          await ref.read(subscriptionProvider.notifier).purchase();
      if (!started && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not start purchase. Try again later.'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(e.toString()), backgroundColor: AppTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _restore() async {
    setState(() => _isLoading = true);
    try {
      await ref.read(subscriptionProvider.notifier).restore();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Purchases restored.')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isPro = ref.watch(subscriptionProvider).value ?? false;

    if (isPro) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) context.pop();
      });
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
        title: const Text('Upgrade to Pro'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHero(),
            _buildFeatureList(),
            _buildPricingCard(),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildHero() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.primary, AppTheme.accent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.workspace_premium,
                color: Colors.white, size: 44),
          ),
          const SizedBox(height: 16),
          const Text(
            'Resume AI Pro',
            style: TextStyle(
                color: Colors.white,
                fontSize: 26,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Unlimited AI operations.\nLand more interviews.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70, fontSize: 15, height: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureList() {
    final features = [
      ('Unlimited AI operations', 'No monthly cap — generate, improve, score as often as you need', Icons.all_inclusive),
      ('Priority AI processing', 'Your requests jump the queue for faster results', Icons.bolt_outlined),
      ('All future features', 'Every new feature we add is included in Pro', Icons.new_releases_outlined),
      ('Support indie development', 'Help us keep Resume AI running and improving', Icons.favorite_outline),
    ];

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: features
            .map((f) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(f.$3, color: AppTheme.primary, size: 20),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(f.$1,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.textPrimary)),
                            const SizedBox(height: 2),
                            Text(f.$2,
                                style: const TextStyle(
                                    color: AppTheme.textSecondary,
                                    fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildPricingCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppTheme.primary.withOpacity(0.08),
              AppTheme.accent.withOpacity(0.08)
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            const Text('Pro Monthly',
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: AppTheme.textPrimary)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('\$',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary)),
                const Text('4.99',
                    style: TextStyle(
                        fontSize: 44,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary)),
                const Padding(
                  padding: EdgeInsets.only(top: 28),
                  child: Text('/month',
                      style: TextStyle(
                          fontSize: 14, color: AppTheme.textSecondary)),
                ),
              ],
            ),
            const Text('Cancel anytime in Play Store settings',
                style:
                    TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildButtons() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          AppButton(
            label: 'Subscribe — \$4.99/month',
            onPressed: _purchase,
            isLoading: _isLoading,
            icon: Icons.workspace_premium,
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: _isLoading ? null : _restore,
            child: const Text(
              'Restore previous purchase',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Subscription auto-renews monthly. Manage in Google Play.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 11),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
