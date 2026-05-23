import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/data/repositories/resume_repository.dart';
import 'package:resume_ai/presentation/state/resume_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';
import 'package:resume_ai/presentation/widgets/error_view.dart';

class ResumeEditorScreen extends ConsumerStatefulWidget {
  final String resumeId;
  const ResumeEditorScreen({super.key, required this.resumeId});

  @override
  ConsumerState<ResumeEditorScreen> createState() => _ResumeEditorScreenState();
}

class _ResumeEditorScreenState extends ConsumerState<ResumeEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _linkedinCtrl = TextEditingController();
  final _githubCtrl = TextEditingController();
  final _summaryCtrl = TextEditingController();
  bool _isLoading = false;
  bool _isInitialized = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _locationCtrl.dispose();
    _linkedinCtrl.dispose();
    _githubCtrl.dispose();
    _summaryCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref.read(resumeRepositoryProvider).updateResume(widget.resumeId, {
        'title': _titleCtrl.text.trim(),
        'personal_info': {
          'name': _nameCtrl.text.trim(),
          'email': _emailCtrl.text.trim(),
          'phone': _phoneCtrl.text.trim(),
          'location': _locationCtrl.text.trim(),
          if (_linkedinCtrl.text.isNotEmpty) 'linkedin': _linkedinCtrl.text.trim(),
          if (_githubCtrl.text.isNotEmpty) 'github': _githubCtrl.text.trim(),
          if (_summaryCtrl.text.isNotEmpty) 'summary': _summaryCtrl.text.trim(),
        },
      });
      await ref.read(resumeListProvider.notifier).refresh();
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final resumeAsync = ref.watch(resumeDetailProvider(widget.resumeId));

    return resumeAsync.when(
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, _) => Scaffold(
        appBar: AppBar(title: const Text('Edit Resume')),
        body: ErrorView(error: error, onRetry: () => ref.invalidate(resumeDetailProvider(widget.resumeId))),
      ),
      data: (resume) {
        if (!_isInitialized) {
          _titleCtrl.text = resume.title;
          _nameCtrl.text = resume.personalInfo.name;
          _emailCtrl.text = resume.personalInfo.email;
          _phoneCtrl.text = resume.personalInfo.phone;
          _locationCtrl.text = resume.personalInfo.location;
          _linkedinCtrl.text = resume.personalInfo.linkedin ?? '';
          _githubCtrl.text = resume.personalInfo.github ?? '';
          _summaryCtrl.text = resume.personalInfo.summary ?? '';
          _isInitialized = true;
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Edit Resume')),
          body: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  AppTextField(
                    label: 'Resume Title',
                    controller: _titleCtrl,
                    validator: (v) =>
                        v?.isEmpty == true ? 'Required' : null,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'Full Name',
                    controller: _nameCtrl,
                    prefixIcon: Icons.person_outline,
                    validator: (v) =>
                        v?.isEmpty == true ? 'Required' : null,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'Email',
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icons.email_outlined,
                    validator: (v) =>
                        v?.isEmpty == true ? 'Required' : null,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'Phone',
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    prefixIcon: Icons.phone_outlined,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'Location',
                    controller: _locationCtrl,
                    prefixIcon: Icons.location_on_outlined,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'LinkedIn URL',
                    controller: _linkedinCtrl,
                    prefixIcon: Icons.link,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'GitHub URL',
                    controller: _githubCtrl,
                    prefixIcon: Icons.code,
                  ),
                  const SizedBox(height: 16),
                  AppTextField(
                    label: 'Professional Summary',
                    controller: _summaryCtrl,
                    maxLines: 4,
                  ),
                  const SizedBox(height: 32),
                  AppButton(
                    label: 'Save Changes',
                    onPressed: _save,
                    isLoading: _isLoading,
                    icon: Icons.save_outlined,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
