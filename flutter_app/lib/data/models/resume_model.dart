class PersonalInfoModel {
  final String name;
  final String email;
  final String phone;
  final String location;
  final String? linkedin;
  final String? github;
  final String? website;
  final String? summary;

  const PersonalInfoModel({
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    this.linkedin,
    this.github,
    this.website,
    this.summary,
  });

  factory PersonalInfoModel.fromJson(Map<String, dynamic> json) =>
      PersonalInfoModel(
        name: json['name'] as String? ?? '',
        email: json['email'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        location: json['location'] as String? ?? '',
        linkedin: json['linkedin'] as String?,
        github: json['github'] as String?,
        website: json['website'] as String?,
        summary: json['summary'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'phone': phone,
        'location': location,
        if (linkedin != null) 'linkedin': linkedin,
        if (github != null) 'github': github,
        if (website != null) 'website': website,
        if (summary != null) 'summary': summary,
      };
}

class WorkExperienceModel {
  final String company;
  final String position;
  final String startDate;
  final String? endDate;
  final bool current;
  final String description;
  final List<String> achievements;

  const WorkExperienceModel({
    required this.company,
    required this.position,
    required this.startDate,
    this.endDate,
    this.current = false,
    required this.description,
    this.achievements = const [],
  });

  factory WorkExperienceModel.fromJson(Map<String, dynamic> json) =>
      WorkExperienceModel(
        company: json['company'] as String,
        position: json['position'] as String,
        startDate: json['start_date'] as String,
        endDate: json['end_date'] as String?,
        current: json['current'] as bool? ?? false,
        description: json['description'] as String,
        achievements: List<String>.from(json['achievements'] ?? []),
      );

  Map<String, dynamic> toJson() => {
        'company': company,
        'position': position,
        'start_date': startDate,
        if (endDate != null) 'end_date': endDate,
        'current': current,
        'description': description,
        'achievements': achievements,
      };
}

class EducationModel {
  final String institution;
  final String degree;
  final String field;
  final String startDate;
  final String? endDate;
  final String? gpa;

  const EducationModel({
    required this.institution,
    required this.degree,
    required this.field,
    required this.startDate,
    this.endDate,
    this.gpa,
  });

  factory EducationModel.fromJson(Map<String, dynamic> json) => EducationModel(
        institution: json['institution'] as String,
        degree: json['degree'] as String,
        field: json['field'] as String,
        startDate: json['start_date'] as String,
        endDate: json['end_date'] as String?,
        gpa: json['gpa'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'institution': institution,
        'degree': degree,
        'field': field,
        'start_date': startDate,
        if (endDate != null) 'end_date': endDate,
        if (gpa != null) 'gpa': gpa,
      };
}

class ProjectModel {
  final String name;
  final String description;
  final List<String> technologies;
  final String? url;

  const ProjectModel({
    required this.name,
    required this.description,
    this.technologies = const [],
    this.url,
  });

  factory ProjectModel.fromJson(Map<String, dynamic> json) => ProjectModel(
        name: json['name'] as String,
        description: json['description'] as String,
        technologies: List<String>.from(json['technologies'] ?? []),
        url: json['url'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'description': description,
        'technologies': technologies,
        if (url != null) 'url': url,
      };
}

class ResumeModel {
  final String id;
  final String userId;
  final String title;
  final PersonalInfoModel personalInfo;
  final List<WorkExperienceModel> workExperience;
  final List<EducationModel> education;
  final List<String> skills;
  final List<ProjectModel> projects;
  final String? jobDescription;
  final String? pdfUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ResumeModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.personalInfo,
    required this.workExperience,
    required this.education,
    required this.skills,
    required this.projects,
    this.jobDescription,
    this.pdfUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ResumeModel.fromJson(Map<String, dynamic> json) => ResumeModel(
        id: json['id'] as String,
        userId: json['user_id'] as String,
        title: json['title'] as String,
        personalInfo: PersonalInfoModel.fromJson(
            json['personal_info'] as Map<String, dynamic>),
        workExperience: (json['work_experience'] as List)
            .map((e) => WorkExperienceModel.fromJson(e as Map<String, dynamic>))
            .toList(),
        education: (json['education'] as List)
            .map((e) => EducationModel.fromJson(e as Map<String, dynamic>))
            .toList(),
        skills: List<String>.from(json['skills'] ?? []),
        projects: (json['projects'] as List)
            .map((e) => ProjectModel.fromJson(e as Map<String, dynamic>))
            .toList(),
        jobDescription: json['job_description'] as String?,
        pdfUrl: json['pdf_url'] as String?,
        createdAt: DateTime.parse(json['created_at'] as String),
        updatedAt: DateTime.parse(json['updated_at'] as String),
      );

  Map<String, dynamic> toJson() => {
        'title': title,
        'personal_info': personalInfo.toJson(),
        'work_experience': workExperience.map((e) => e.toJson()).toList(),
        'education': education.map((e) => e.toJson()).toList(),
        'skills': skills,
        'projects': projects.map((e) => e.toJson()).toList(),
        if (jobDescription != null) 'job_description': jobDescription,
      };
}
