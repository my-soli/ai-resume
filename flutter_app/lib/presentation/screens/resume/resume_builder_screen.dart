import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:resume_ai/core/theme/app_theme.dart';
import 'package:resume_ai/presentation/state/resume_provider.dart';
import 'package:resume_ai/presentation/widgets/app_button.dart';

class ResumeBuilderScreen extends ConsumerStatefulWidget {
  const ResumeBuilderScreen({super.key});

  @override
  ConsumerState<ResumeBuilderScreen> createState() =>
      _ResumeBuilderScreenState();
}

class _ResumeBuilderScreenState extends ConsumerState<ResumeBuilderScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  bool _isSaving = false;

  // Personal info
  final _titleCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _linkedinCtrl = TextEditingController();
  final _githubCtrl = TextEditingController();
  final _summaryCtrl = TextEditingController();
  final _jobDescCtrl = TextEditingController();

  // Skills
  final _skillCtrl = TextEditingController();
  final List<String> _skills = [];

  // Work experience
  final List<Map<String, dynamic>> _workExperience = [];

  // Education
  final List<Map<String, dynamic>> _education = [];

  // Projects
  final List<Map<String, dynamic>> _projects = [];

  final List<GlobalKey<FormState>> _formKeys = List.generate(
    5,
    (_) => GlobalKey<FormState>(),
  );

  @override
  void dispose() {
    _pageController.dispose();
    _titleCtrl.dispose();
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _locationCtrl.dispose();
    _linkedinCtrl.dispose();
    _githubCtrl.dispose();
    _summaryCtrl.dispose();
    _jobDescCtrl.dispose();
    _skillCtrl.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (!_formKeys[_currentPage].currentState!.validate()) return;
    if (_currentPage < 4) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _save();
    }
  }

  void _prevPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _save() async {
    setState(() => _isSaving = true);
    try {
      final data = {
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
        'work_experience': _workExperience,
        'education': _education,
        'skills': _skills,
        'projects': _projects,
        if (_jobDescCtrl.text.isNotEmpty)
          'job_description': _jobDescCtrl.text.trim(),
      };

      final resume =
          await ref.read(resumeListProvider.notifier).create(data);
      if (mounted) context.go('/resume/${resume.id}');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final stepTitles = [
      'Basic Info',
      'Experience',
      'Education',
      'Skills',
      'Projects',
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(stepTitles[_currentPage]),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _currentPage == 0
              ? () => context.pop()
              : _prevPage,
        ),
      ),
      body: Column(
        children: [
          _buildProgressIndicator(),
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              onPageChanged: (i) => setState(() => _currentPage = i),
              children: [
                _buildBasicInfoPage(),
                _buildWorkExperiencePage(),
                _buildEducationPage(),
                _buildSkillsPage(),
                _buildProjectsPage(),
              ],
            ),
          ),
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: List.generate(5, (i) {
          return Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 2),
              height: 4,
              decoration: BoxDecoration(
                color: i <= _currentPage
                    ? AppTheme.primary
                    : AppTheme.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildBasicInfoPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKeys[0],
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppTextField(
              label: 'Resume Title *',
              hint: 'e.g. Software Engineer Resume',
              controller: _titleCtrl,
              validator: (v) => v?.isEmpty == true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Full Name *',
              controller: _nameCtrl,
              prefixIcon: Icons.person_outline,
              validator: (v) => v?.isEmpty == true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Email *',
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
              prefixIcon: Icons.email_outlined,
              validator: (v) =>
                  v?.isEmpty == true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Phone *',
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              prefixIcon: Icons.phone_outlined,
              validator: (v) => v?.isEmpty == true ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Location *',
              hint: 'City, State',
              controller: _locationCtrl,
              prefixIcon: Icons.location_on_outlined,
              validator: (v) => v?.isEmpty == true ? 'Required' : null,
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
              hint: 'Brief overview of your career...',
              controller: _summaryCtrl,
              maxLines: 4,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Target Job Description (optional)',
              hint: 'Paste the job description for AI optimization...',
              controller: _jobDescCtrl,
              maxLines: 5,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkExperiencePage() {
    return Form(
      key: _formKeys[1],
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            ..._workExperience.asMap().entries.map((entry) {
              final i = entry.key;
              final exp = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              '${exp['position']} at ${exp['company']}',
                              style: const TextStyle(fontWeight: FontWeight.w600),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline,
                                color: AppTheme.error),
                            onPressed: () =>
                                setState(() => _workExperience.removeAt(i)),
                          ),
                        ],
                      ),
                      Text(
                        '${exp['start_date']} – ${exp['current'] == true ? 'Present' : exp['end_date'] ?? ''}',
                        style: const TextStyle(
                            color: AppTheme.textSecondary, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              );
            }),
            OutlinedButton.icon(
              onPressed: _showAddExperienceDialog,
              icon: const Icon(Icons.add),
              label: const Text('Add Work Experience'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEducationPage() {
    return Form(
      key: _formKeys[2],
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            ..._education.asMap().entries.map((entry) {
              final i = entry.key;
              final edu = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${edu['degree']} in ${edu['field']}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            Text(edu['institution'] as String,
                                style: const TextStyle(
                                    color: AppTheme.textSecondary,
                                    fontSize: 12)),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline,
                            color: AppTheme.error),
                        onPressed: () =>
                            setState(() => _education.removeAt(i)),
                      ),
                    ],
                  ),
                ),
              );
            }),
            OutlinedButton.icon(
              onPressed: _showAddEducationDialog,
              icon: const Icon(Icons.add),
              label: const Text('Add Education'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSkillsPage() {
    return Form(
      key: _formKeys[3],
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _skillCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Type a skill and press Add',
                    ),
                    onSubmitted: (_) => _addSkill(),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _addSkill,
                  child: const Text('Add'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _skills
                  .map((skill) => Chip(
                        label: Text(skill),
                        onDeleted: () =>
                            setState(() => _skills.remove(skill)),
                        backgroundColor: AppTheme.primary.withOpacity(0.1),
                        labelStyle:
                            const TextStyle(color: AppTheme.primary),
                        deleteIconColor: AppTheme.primary,
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectsPage() {
    return Form(
      key: _formKeys[4],
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            ..._projects.asMap().entries.map((entry) {
              final i = entry.key;
              final proj = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(proj['name'] as String,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600)),
                            if ((proj['technologies'] as List).isNotEmpty)
                              Text(
                                  (proj['technologies'] as List).join(', '),
                                  style: const TextStyle(
                                      color: AppTheme.textSecondary,
                                      fontSize: 12)),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline,
                            color: AppTheme.error),
                        onPressed: () =>
                            setState(() => _projects.removeAt(i)),
                      ),
                    ],
                  ),
                ),
              );
            }),
            OutlinedButton.icon(
              onPressed: _showAddProjectDialog,
              icon: const Icon(Icons.add),
              label: const Text('Add Project'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE5E7EB))),
      ),
      child: AppButton(
        label: _currentPage < 4 ? 'Continue' : 'Save Resume',
        onPressed: _nextPage,
        isLoading: _isSaving,
        icon: _currentPage < 4 ? Icons.arrow_forward : Icons.check,
      ),
    );
  }

  void _addSkill() {
    final skill = _skillCtrl.text.trim();
    if (skill.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a skill name first')),
      );
      return;
    }
    if (_skills.contains(skill)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('"$skill" is already added')),
      );
      return;
    }
    setState(() => _skills.add(skill));
    _skillCtrl.clear();
  }

  void _showAddExperienceDialog() {
    final companyCtrl = TextEditingController();
    final positionCtrl = TextEditingController();
    final startCtrl = TextEditingController();
    final endCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    bool isCurrent = false;

    showDialog(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Text('Add Work Experience'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: companyCtrl,
                    decoration: const InputDecoration(labelText: 'Company *')),
                const SizedBox(height: 8),
                TextField(
                    controller: positionCtrl,
                    decoration:
                        const InputDecoration(labelText: 'Position *')),
                const SizedBox(height: 8),
                TextField(
                    controller: startCtrl,
                    decoration: const InputDecoration(
                        labelText: 'Start Date', hintText: '2020-01')),
                const SizedBox(height: 8),
                if (!isCurrent)
                  TextField(
                      controller: endCtrl,
                      decoration: const InputDecoration(
                          labelText: 'End Date', hintText: '2023-06')),
                CheckboxListTile(
                  title: const Text('Currently working here'),
                  value: isCurrent,
                  onChanged: (v) => setDialogState(() => isCurrent = v!),
                  contentPadding: EdgeInsets.zero,
                ),
                TextField(
                  controller: descCtrl,
                  decoration: const InputDecoration(labelText: 'Description'),
                  maxLines: 3,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                if (companyCtrl.text.trim().isEmpty || positionCtrl.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Company and Position are required')),
                  );
                  return;
                }
                setState(() => _workExperience.add({
                      'company': companyCtrl.text.trim(),
                      'position': positionCtrl.text.trim(),
                      'start_date': startCtrl.text.trim(),
                      'end_date': isCurrent ? null : endCtrl.text.trim(),
                      'current': isCurrent,
                      'description': descCtrl.text.trim(),
                      'achievements': [],
                    }));
                Navigator.pop(ctx);
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddEducationDialog() {
    final institutionCtrl = TextEditingController();
    final degreeCtrl = TextEditingController();
    final fieldCtrl = TextEditingController();
    final startCtrl = TextEditingController();
    final endCtrl = TextEditingController();
    final gpaCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add Education'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                  controller: institutionCtrl,
                  decoration:
                      const InputDecoration(labelText: 'Institution *')),
              const SizedBox(height: 8),
              TextField(
                  controller: degreeCtrl,
                  decoration: const InputDecoration(
                      labelText: 'Degree *', hintText: 'Bachelor of Science')),
              const SizedBox(height: 8),
              TextField(
                  controller: fieldCtrl,
                  decoration: const InputDecoration(
                      labelText: 'Field *', hintText: 'Computer Science')),
              const SizedBox(height: 8),
              TextField(
                  controller: startCtrl,
                  decoration: const InputDecoration(
                      labelText: 'Start', hintText: '2016-09')),
              const SizedBox(height: 8),
              TextField(
                  controller: endCtrl,
                  decoration: const InputDecoration(
                      labelText: 'End', hintText: '2020-05')),
              const SizedBox(height: 8),
              TextField(
                  controller: gpaCtrl,
                  decoration:
                      const InputDecoration(labelText: 'GPA (optional)')),
            ],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (institutionCtrl.text.trim().isEmpty ||
                  degreeCtrl.text.trim().isEmpty ||
                  fieldCtrl.text.trim().isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Institution, Degree, and Field are required')),
                );
                return;
              }
              setState(() => _education.add({
                    'institution': institutionCtrl.text.trim(),
                    'degree': degreeCtrl.text.trim(),
                    'field': fieldCtrl.text.trim(),
                    'start_date': startCtrl.text.trim(),
                    'end_date': endCtrl.text.trim(),
                    if (gpaCtrl.text.isNotEmpty) 'gpa': gpaCtrl.text.trim(),
                  }));
              Navigator.pop(ctx);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showAddProjectDialog() {
    final nameCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final urlCtrl = TextEditingController();
    final techCtrl = TextEditingController();
    final List<String> techs = [];

    showDialog(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Text('Add Project'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: nameCtrl,
                    decoration:
                        const InputDecoration(labelText: 'Project Name *')),
                const SizedBox(height: 8),
                TextField(
                  controller: descCtrl,
                  decoration:
                      const InputDecoration(labelText: 'Description *'),
                  maxLines: 3,
                ),
                const SizedBox(height: 8),
                TextField(
                    controller: urlCtrl,
                    decoration: const InputDecoration(
                        labelText: 'URL', hintText: 'github.com/...')),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                          controller: techCtrl,
                          decoration: const InputDecoration(
                              labelText: 'Add Technology')),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add),
                      onPressed: () {
                        if (techCtrl.text.isNotEmpty) {
                          setDialogState(() {
                            techs.add(techCtrl.text.trim());
                            techCtrl.clear();
                          });
                        }
                      },
                    ),
                  ],
                ),
                if (techs.isNotEmpty)
                  Wrap(
                    spacing: 4,
                    children: techs
                        .map((t) => Chip(
                              label: Text(t, style: const TextStyle(fontSize: 12)),
                              onDeleted: () =>
                                  setDialogState(() => techs.remove(t)),
                            ))
                        .toList(),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                if (nameCtrl.text.trim().isEmpty || descCtrl.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Project name and description are required')),
                  );
                  return;
                }
                setState(() => _projects.add({
                      'name': nameCtrl.text.trim(),
                      'description': descCtrl.text.trim(),
                      'technologies': List<String>.from(techs),
                      if (urlCtrl.text.isNotEmpty) 'url': urlCtrl.text.trim(),
                    }));
                Navigator.pop(ctx);
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }
}
