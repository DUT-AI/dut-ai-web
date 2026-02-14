import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center border-t border-gray-200 pt-8 dark:border-gray-700">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
          <SocialIcon kind="medium" href={siteMetadata.medium} size={6} />
        </div>

        <div className="mb-6 flex flex-col items-center text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2 flex items-center space-x-2 font-semibold text-gray-800 dark:text-gray-200">
            <span>{siteMetadata.headerTitle}</span>
            <span>•</span>
            <span>{`© ${new Date().getFullYear()}`}</span>
          </div>

          <div className="space-y-1">
            <p>📞 Hotline: {siteMetadata.phone}</p>
            <p>📍 Địa chỉ: {siteMetadata.address}</p>
            <p className="mt-2 text-xs italic opacity-80">"{siteMetadata.slogan}"</p>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center space-y-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-primary-500 transition">
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
