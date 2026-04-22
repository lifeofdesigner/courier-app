import { CmsLinkField } from "@/components/admin/cms-link-field";
import { CmsManagedForm } from "@/components/admin/cms-editor-shell";
import { CmsPublishBar } from "@/components/admin/cms-publish-bar";
import { CmsRepeatableList } from "@/components/admin/cms-repeatable-list";
import { CmsSectionHeader } from "@/components/admin/cms-section-header";
import { CmsTextareaField } from "@/components/admin/cms-textarea-field";
import { CmsTextField } from "@/components/admin/cms-text-field";
import type { AdminCmsEditorSection } from "@/types/admin";
import type { FAQPageContent } from "@/types/cms";

export type FaqCmsFormProps = {
  section: AdminCmsEditorSection<FAQPageContent>;
};

export function FaqCmsForm({ section }: FaqCmsFormProps) {
  const content = section.value;
  const flatItems = content.groups.flatMap((group) =>
    group.items.map((item) => ({
      group: group.title,
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <section
      id="faq"
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <CmsSectionHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Edit FAQ page headings, grouped questions, support CTA, and search metadata."
        published={section.published}
      />
      <div className="mt-6 space-y-5">
        <CmsManagedForm
          formType="faqPage.content"
          section={section.section}
          cmsKey={section.key}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField label="Hero eyebrow" name="faqPage.hero.eyebrow" defaultValue={content.hero.eyebrow} />
            <CmsTextField label="Hero headline" name="faqPage.hero.title" defaultValue={content.hero.title} />
          </div>
          <CmsTextareaField
            label="Hero subtitle"
            name="faqPage.hero.description"
            defaultValue={content.hero.description}
          />
          <CmsRepeatableList
            label="FAQ items"
            name="faqPage.items"
            addLabel="Add FAQ item"
            emptyItem={{ group: "General", question: "", answer: "" }}
            items={flatItems}
            fields={[
              { name: "group", label: "Group" },
              { name: "question", label: "Question" },
              { name: "answer", label: "Answer", type: "textarea" },
            ]}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Support CTA headline"
              name="faqPage.supportCta.title"
              defaultValue={content.supportCta.title}
            />
            <CmsTextField
              label="SEO title"
              name="faqPage.seo.title"
              defaultValue={content.seo.title}
            />
          </div>
          <CmsTextareaField
            label="Support CTA subtitle"
            name="faqPage.supportCta.description"
            defaultValue={content.supportCta.description}
          />
          <CmsLinkField
            label="Support CTA button"
            name="faqPage.supportCta.cta"
            defaultValue={content.supportCta.cta}
          />
          <CmsTextareaField
            label="SEO description"
            name="faqPage.seo.description"
            defaultValue={content.seo.description}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <CmsTextField
              label="Keywords"
              name="faqPage.seo.keywords"
              defaultValue={content.seo.keywords?.join(", ")}
            />
            <CmsTextField
              label="Canonical path"
              name="faqPage.seo.canonicalPath"
              defaultValue={content.seo.canonicalPath}
            />
          </div>
        </CmsManagedForm>
        <CmsPublishBar
          id={section.id}
          section={section.section}
          cmsKey={section.key}
          published={section.published}
          updatedAt={section.updatedAt}
        />
      </div>
    </section>
  );
}
