import { mockFeatures } from "../mockLandingPage"

function FeatureSection() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {mockFeatures.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="text-xs font-semibold">{feature.title}</h3>
            <p className="text-[0.625rem] leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
