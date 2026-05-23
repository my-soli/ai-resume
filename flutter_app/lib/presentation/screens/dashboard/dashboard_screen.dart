import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/data/models/resume_model.dart';
import 'package:resume_ai/presentation/state/auth_provider.dart';
import 'package:resume_ai/presentation/state/resume_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';
import 'package:resume_ai/presentation/widgets/error_view.dart';
import 'package:resume_ai/presentation/screens/settings/privacy_policy_screen.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).value;
    final resumeState = ref.watch(resumeListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Resumes'),
        actions: [
          PopupMenuButton(
            icon: CircleAvatar(
              backgroundColor: AppTheme.primary.withOpacity(0.12),
              child: Text(
                user?.fullName.isNotEmpty == true
                    ? user!.fullName[0].toUpperCase()
                    : 'U',
                style: const TextStyle(
                    color: AppTheme.primary, fontWeight: FontWeight.bold),
              ),
            ),
            itemBuilder: (_) => [
              const PopupMenuItem(
                value: 'privacy',
                child: Row(
                  children: [
                    Icon(Icons.privacy_tip_outlined, size: 18),
                    SizedBox(width: 8),
                    Text('Privacy Policy'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 18),
                    SizedBox(width: 8),
                    Text('Sign out'),
                  ],
                ),
              ),
            ],
            onSelected: (value) async {
              if (value == 'logout') {
                await ref.read(authStateProvider.notifier).logout();
              } else if (value == 'privacy') {
                context.push('/privacy-policy');
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(resumeListProvider.notifier).refresh(),
        child: resumeState.when(
          loading: () => _buildShimmer(),
          error: (error, _) => ErrorView(
            error: error,
            onRetry: () => ref.read(resumeListProvider.notifier).refresh(),
          ),
          data: (resumes) => resumes.isEmpty
              ? _buildEmptyState(context)
              : _buildResumeList(context, ref, resumes),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/resume/new'),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Resume'),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.description_outlined,
                size: 48,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'No resumes yet',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create your first AI-powered resume\nand land your dream job.',
              textAlign: TextAlign.center,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 32),
            AppButton(
              label: 'Create Resume',
              icon: Icons.add,
              onPressed: () => context.push('/resume/new'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResumeList(
      BuildContext context, WidgetRef ref, List<ResumeModel> resumes) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: resumes.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final resume = resumes[index];
        return _ResumeCard(resume: resume, ref: ref);
      },
    );
  }

  Widget _buildShimmer() {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, __) => Shimmer.fromColors(
        baseColor: Colors.grey[200]!,
        highlightColor: Colors.grey[50]!,
        child: Container(
          height: 96,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    );
  }
}

class _ResumeCard extends StatelessWidget {
  final ResumeModel resume;
  final WidgetRef ref;

  const _ResumeCard({required this.resume, required this.ref});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: () => context.push('/resume/${resume.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.description_rounded,
                  color: AppTheme.primary,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resume.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      resume.personalInfo.name.isNotEmpty
                          ? resume.personalInfo.name
                          : 'No name set',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.textSecondary,
                          ),
                    ),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, color: AppTheme.textSecondary),
                onSelected: (value) async {
                  if (value == 'edit') {
                    context.push('/resume/${resume.id}/edit');
                  } else if (value == 'ai') {
                    context.push('/resume/${resume.id}/ai-result');
                  } else if (value == 'delete') {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('Delete resume?'),
                        content: const Text(
                            'This action cannot be undone.'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, true),
                            style: TextButton.styleFrom(
                                foregroundColor: AppTheme.error),
                            child: const Text('Delete'),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true) {
                      await ref
                          .read(resumeListProvider.notifier)
                          .delete(resume.id);
                    }
                  }
                },
                itemBuilder: (_) => const [
                  PopupMenuItem(
                      value: 'edit',
                      child: Row(children: [
                        Icon(Icons.edit_outlined, size: 18),
                        SizedBox(width: 8),
                        Text('Edit')
                      ])),
                  PopupMenuItem(
                      value: 'ai',
                      child: Row(children: [
                        Icon(Icons.auto_awesome, size: 18),
                        SizedBox(width: 8),
                        Text('AI Optimize')
                      ])),
                  PopupMenuItem(
                      value: 'delete',
                      child: Row(children: [
                        Icon(Icons.delete_outline, size: 18, color: AppTheme.error),
                        SizedBox(width: 8),
                        Text('Delete',
                            style: TextStyle(color: AppTheme.error))
                      ])),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
