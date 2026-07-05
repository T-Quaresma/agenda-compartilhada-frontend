const avatarModules = import.meta.glob('./*.svg', {eager: true, as: 'url'})
const avatars = Object.values(avatarModules) as string[]

export default avatars