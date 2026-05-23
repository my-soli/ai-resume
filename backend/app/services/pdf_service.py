import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER


def generate_resume_pdf(resume_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "Name",
        parent=styles["Normal"],
        fontSize=18,
        fontName="Helvetica-Bold",
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    contact_style = ParagraphStyle(
        "Contact",
        parent=styles["Normal"],
        fontSize=9,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
    section_style = ParagraphStyle(
        "Section",
        parent=styles["Normal"],
        fontSize=11,
        fontName="Helvetica-Bold",
        spaceBefore=10,
        spaceAfter=2,
        textColor=colors.HexColor("#1a1a1a"),
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"], fontSize=9, spaceAfter=3, leading=14
    )
    job_title_style = ParagraphStyle(
        "JobTitle",
        parent=styles["Normal"],
        fontSize=10,
        fontName="Helvetica-Bold",
        spaceAfter=1,
    )
    meta_style = ParagraphStyle(
        "Meta",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.HexColor("#555555"),
        spaceAfter=3,
    )

    story = []
    personal = resume_data.get("personal_info", {})

    if personal.get("name"):
        story.append(Paragraph(personal["name"].upper(), name_style))

    contact_parts = [
        personal[f]
        for f in ["email", "phone", "location"]
        if personal.get(f)
    ]
    for f in ["linkedin", "github", "website"]:
        if personal.get(f):
            contact_parts.append(personal[f])
    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), contact_style))

    story.append(
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#333333"))
    )

    if personal.get("summary"):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"))
        )
        story.append(Spacer(1, 4))
        story.append(Paragraph(personal["summary"], body_style))

    work_exp = resume_data.get("work_experience", [])
    if work_exp:
        story.append(Paragraph("WORK EXPERIENCE", section_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"))
        )
        story.append(Spacer(1, 4))
        for exp in work_exp:
            end = "Present" if exp.get("current") else exp.get("end_date", "Present")
            story.append(
                Paragraph(
                    f"{exp.get('position', '')} — {exp.get('company', '')}",
                    job_title_style,
                )
            )
            story.append(
                Paragraph(f"{exp.get('start_date', '')} – {end}", meta_style)
            )
            if exp.get("description"):
                story.append(Paragraph(exp["description"], body_style))
            for achievement in exp.get("achievements", []):
                story.append(Paragraph(f"• {achievement}", body_style))
            story.append(Spacer(1, 6))

    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"))
        )
        story.append(Spacer(1, 4))
        for edu in education:
            story.append(
                Paragraph(
                    f"{edu.get('degree', '')} in {edu.get('field', '')} — {edu.get('institution', '')}",
                    job_title_style,
                )
            )
            end = edu.get("end_date", "")
            story.append(
                Paragraph(f"{edu.get('start_date', '')} – {end}", meta_style)
            )
            if edu.get("gpa"):
                story.append(Paragraph(f"GPA: {edu['gpa']}", body_style))
            story.append(Spacer(1, 6))

    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"))
        )
        story.append(Spacer(1, 4))
        story.append(Paragraph("  •  ".join(skills), body_style))

    projects = resume_data.get("projects", [])
    if projects:
        story.append(Paragraph("PROJECTS", section_style))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cccccc"))
        )
        story.append(Spacer(1, 4))
        for proj in projects:
            title = proj.get("name", "")
            if proj.get("url"):
                title += f" | {proj['url']}"
            story.append(Paragraph(title, job_title_style))
            if proj.get("technologies"):
                story.append(
                    Paragraph(
                        f"Technologies: {', '.join(proj['technologies'])}", meta_style
                    )
                )
            if proj.get("description"):
                story.append(Paragraph(proj["description"], body_style))
            story.append(Spacer(1, 6))

    doc.build(story)
    return buffer.getvalue()
