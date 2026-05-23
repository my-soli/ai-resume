import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/data/repositories/resume_repository.dart';
import 'package:resume_ai/presentation/state/resume_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';
import 'package:resume_ai/presentation/widgets/error_view.dart';

class ResumeDetailScreen extends ConsumerStatefulWidget {
  final String resumeId;
  const ResumeDetailScreen({super.key, required this.resumeId});

  @override
  ConsumerState<ResumeDetailScreen> createState() =>
      _ResumeDetailScreenState();
}

class _ResumeDetailScreenState extends ConsumerState<ResumeDetailScreen> {
  bool _isDownloading = false;

  Future<void> _downloadPdf() async {
    setState(() => _isDownloading = true);
    try {
      final bytes = await ref
          .read(resumeRepositoryProvider)
          .downloadPdf(widget.resumeId);

      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/resume_${widget.resumeId.substring(0, 8)}.pdf');
      await file.writeAsBytes(bytes);

      if (mounted) {
        await Share.shareXFiles(
          [XFile(file.path, mimeType: 'application/pdf')],
          subject: 'My Resume',
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isDownloading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final resumeAsync = ref.watch(resumeDetailProvider(widget.resumeId));

    return resumeAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, _) => Scaffold(
        appBar: AppBar(title: const Text('Resume')),
        body: ErrorView(error: error, onRetry: () => ref.invalidate(resumeDetailProvider(widget.resumeId))),
      ),
      data: (resume) => Scaffold(
        appBar: AppBar(
          title: Text(resume.title),
          actions: [
            IconButton(
              icon: const Icon(Icons.edit_outlined),
              onPressed: () => context.push('/resume/${resume.id}/edit'),
            ),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _InfoCard(
                icon: Icons.person_outline,
                title: 'Personal Info',
                children: [
                  _InfoRow('Name', resume.personalInfo.name),
                  _InfoRow('Email', resume.personalInfo.email),
                  _InfoRow('Phone', resume.personalInfo.phone),
                  _InfoRow('Location', resume.personalInfo.location),
                  if (resume.personalInfo.linkedin != null)
                    _InfoRow('LinkedIn', resume.personalInfo.linkedin!),
                  if (resume.personalInfo.github != null)
                    _InfoRow('GitHub', resume.personalInfo.github!),
                  if (resume.personalInfo.summary != null)
                    _InfoRow('Summary', resume.personalInfo.summary!),
                ],
              ),
              const SizedBox(height: 12),
              if (resume.workExperience.isNotEmpty)
                _InfoCard(
                  icon: Icons.work_outline,
                  title: 'Work Experience (${resume.workExperience.length})',
                  children: resume.workExperience
                      .map((exp) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${exp.position} at ${exp.company}',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600),
                                ),
                                Text(
                                  '${exp.startDate} – ${exp.current ? 'Present' : exp.endDate ?? ''}',
                                  style: const TextStyle(
                                      color: AppTheme.textSecondary,
                                      fontSize: 13),
                                ),
                                if (exp.description.isNotEmpty)
                                  Text(exp.description,
                                      style: const TextStyle(fontSize: 13)),
                              ],
                            ),
                          ))
                      .toList(),
                ),
              const SizedBox(height: 12),
              if (resume.education.isNotEmpty)
                _InfoCard(
                  icon: Icons.school_outlined,
                  title: 'Education',
                  children: resume.education
                      .map((edu) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${edu.degree} in ${edu.field}',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600),
                                ),
                                Text(edu.institution,
                                    style: const TextStyle(
                                        color: AppTheme.textSecondary,
                                        fontSize: 13)),
                              ],
                            ),
                          ))
                      .toList(),
                ),
              const SizedBox(height: 12),
              if (resume.skills.isNotEmpty)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.build_outlined,
                                color: AppTheme.primary, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Skills (${resume.skills.length})',
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600, fontSize: 15),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 6,
                          children: resume.skills
                              .map((s) => Chip(
                                    label: Text(s,
                                        style: const TextStyle(fontSize: 12)),
                                    backgroundColor:
                                        AppTheme.primary.withOpacity(0.1),
                                    labelStyle: const TextStyle(
                                        color: AppTheme.primary),
                                  ))
                              .toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 24),
              AppButton(
                label: 'AI Optimize',
                icon: Icons.auto_awesome,
                onPressed: () =>
                    context.push('/resume/${resume.id}/ai-result'),
              ),
              const SizedBox(height: 12),
              AppButton(
                label: 'Download PDF',
                icon: Icons.download,
                outlined: true,
                onPressed: _downloadPdf,
                isLoading: _isDownloading,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final List<Widget> children;

  const _InfoCard({
    required this.icon,
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: AppTheme.primary, size: 20),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 15),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 13),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}
