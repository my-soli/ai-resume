import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/data/models/ai_result_model.dart';
import 'package:resume_ai/presentation/state/ai_provider.dart';
import 'package:resume_ai/presentation/state/subscription_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';
import 'package:resume_ai/presentation/widgets/error_view.dart';

class AIResultScreen extends ConsumerWidget {
  final String resumeId;
  const AIResultScreen({super.key, required this.resumeId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final aiState = ref.watch(aiResultProvider(resumeId));

    return Scaffold(
      appBar: AppBar(title: const Text('AI Optimizer')),
      body: aiState.when(
        loading: () => const _LoadingView(),
        error: (error, _) => ErrorView(
          error: error,
          onRetry: () => ref.invalidate(aiResultProvider(resumeId)),
        ),
        data: (result) =>
            result == null ? _buildInitialView(context, ref) : _buildResultView(context, ref, result),
      ),
    );
  }

  Widget _buildInitialView(BuildContext context, WidgetRef ref) {
    final usageAsync = ref.watch(aiUsageProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 20),
          usageAsync.when(
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
            data: (usage) {
              final isPro = usage['is_pro'] as bool? ?? false;
              final used = usage['calls_used'] as int? ?? 0;
              final limit = usage['calls_limit'] as int?;
              if (isPro) {
                return Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: AppTheme.scoreGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppTheme.scoreGreen.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.workspace_premium, color: AppTheme.scoreGreen, size: 16),
                      SizedBox(width: 8),
                      Text('Pro — Unlimited AI operations',
                          style: TextStyle(color: AppTheme.scoreGreen, fontSize: 13, fontWeight: FontWeight.w500)),
                    ],
                  ),
                );
              }
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: used >= (limit ?? 3)
                      ? AppTheme.error.withOpacity(0.08)
                      : AppTheme.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: used >= (limit ?? 3)
                        ? AppTheme.error.withOpacity(0.3)
                        : AppTheme.primary.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      used >= (limit ?? 3) ? Icons.warning_amber_outlined : Icons.auto_awesome_outlined,
                      color: used >= (limit ?? 3) ? AppTheme.error : AppTheme.primary,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        used >= (limit ?? 3)
                            ? 'Free limit reached ($used/${limit ?? 3}). Upgrade to continue.'
                            : '$used/${limit ?? 3} free AI operations used this month',
                        style: TextStyle(
                          color: used >= (limit ?? 3) ? AppTheme.error : AppTheme.primary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    if (used >= (limit ?? 3))
                      GestureDetector(
                        onTap: () => context.push('/upgrade'),
                        child: const Text('Upgrade',
                            style: TextStyle(
                                color: AppTheme.primary,
                                fontWeight: FontWeight.bold,
                                fontSize: 13)),
                      ),
                  ],
                ),
              );
            },
          ),
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.primary, AppTheme.accent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(Icons.auto_awesome, size: 48, color: Colors.white),
          ),
          const SizedBox(height: 24),
          Text(
            'AI Resume Optimizer',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Let AI analyze your resume and provide\nATS-optimized improvements.',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 40),
          _ActionCard(
            icon: Icons.create_outlined,
            title: 'Generate Resume',
            subtitle: 'Create a full optimized resume from your data',
            color: AppTheme.primary,
            onTap: () => ref.read(aiResultProvider(resumeId).notifier).generate(),
          ),
          const SizedBox(height: 12),
          _ActionCard(
            icon: Icons.upgrade_outlined,
            title: 'Improve Resume',
            subtitle: 'Rewrite and strengthen your existing content',
            color: AppTheme.accent,
            onTap: () => ref.read(aiResultProvider(resumeId).notifier).improve(),
          ),
          const SizedBox(height: 12),
          _ActionCard(
            icon: Icons.analytics_outlined,
            title: 'Score Resume',
            subtitle: 'Get your ATS score and improvement tips',
            color: AppTheme.scoreYellow,
            onTap: () => ref.read(aiResultProvider(resumeId).notifier).score(),
          ),
        ],
      ),
    );
  }

  Widget _buildResultView(
      BuildContext context, WidgetRef ref, AIResultModel result) {
    final scoreColor = result.atsScore >= 80
        ? AppTheme.scoreGreen
        : result.atsScore >= 60
            ? AppTheme.scoreYellow
            : AppTheme.scoreRed;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Score card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  CircularPercentIndicator(
                    radius: 48,
                    lineWidth: 8,
                    percent: result.atsScore / 100,
                    center: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${result.atsScore}',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: scoreColor,
                          ),
                        ),
                        Text('ATS',
                            style: const TextStyle(
                                fontSize: 11, color: AppTheme.textSecondary)),
                      ],
                    ),
                    progressColor: scoreColor,
                    backgroundColor: scoreColor.withOpacity(0.15),
                    circularStrokeCap: CircularStrokeCap.round,
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          result.scoreLabel,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: scoreColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'ATS Compatibility Score',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppTheme.textSecondary,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          result.operation.toUpperCase(),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primary.withOpacity(0.8),
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Keywords
          if (result.keywordsUsed.isNotEmpty) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.key_outlined,
                            color: AppTheme.primary, size: 18),
                        SizedBox(width: 8),
                        Text('Keywords Used',
                            style: TextStyle(
                                fontWeight: FontWeight.w600, fontSize: 15)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: result.keywordsUsed
                          .map((kw) => Chip(
                                label: Text(kw,
                                    style: const TextStyle(fontSize: 11)),
                                backgroundColor: AppTheme.accent.withOpacity(0.1),
                                labelStyle:
                                    const TextStyle(color: AppTheme.accent),
                                materialTapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                                padding: EdgeInsets.zero,
                                labelPadding: const EdgeInsets.symmetric(
                                    horizontal: 8),
                              ))
                          .toList(),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Improvements
          if (result.improvements.isNotEmpty) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.tips_and_updates_outlined,
                            color: AppTheme.scoreYellow, size: 18),
                        SizedBox(width: 8),
                        Text('Improvements',
                            style: TextStyle(
                                fontWeight: FontWeight.w600, fontSize: 15)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...result.improvements.map(
                      (imp) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              margin: const EdgeInsets.only(top: 5),
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: AppTheme.scoreYellow,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                                child: Text(imp,
                                    style: const TextStyle(fontSize: 13))),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Generated resume text
          if (result.resumeText.isNotEmpty) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.article_outlined,
                            color: AppTheme.primary, size: 18),
                        const SizedBox(width: 8),
                        const Text('Optimized Resume',
                            style: TextStyle(
                                fontWeight: FontWeight.w600, fontSize: 15)),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.copy_outlined, size: 18),
                          onPressed: () {
                            Clipboard.setData(
                                ClipboardData(text: result.resumeText));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Copied to clipboard')),
                            );
                          },
                          tooltip: 'Copy',
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: SelectableText(
                        result.resumeText,
                        style: const TextStyle(
                          fontSize: 12,
                          height: 1.6,
                          fontFamily: 'monospace',
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Run again buttons
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Re-run',
                  outlined: true,
                  icon: Icons.refresh,
                  onPressed: () =>
                      ref.read(aiResultProvider(resumeId).notifier).score(),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Improve',
                  icon: Icons.upgrade,
                  onPressed: () =>
                      ref.read(aiResultProvider(resumeId).notifier).improve(),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 15),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                          color: AppTheme.textSecondary, fontSize: 12),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios,
                  size: 14, color: AppTheme.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: AppTheme.primary),
          const SizedBox(height: 24),
          Text(
            'AI is analyzing your resume...',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppTheme.textSecondary,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'This may take 10–20 seconds',
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: AppTheme.textSecondary),
          ),
        ],
      ),
    );
  }
}
