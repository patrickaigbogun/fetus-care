import ProfileCard from "@/components/ui/profilecard"
import { Container, Section, TextArea } from "@radix-ui/themes"


const Profiles = [
	{
		name: 'Joe Biden',
		job: 'President ex.'
	},
	{
		name: 'Bama Oba',
		job: 'President deus'
	},
	{
		name: 'Muhammad',
		job: 'former '
	}
]

function ReceptionPage() {

	return (
		<Container>
			<TextArea></TextArea>
			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
				{
					Profiles.map((profile, index) => (
						<Section key={index}>
							<ProfileCard key={index} name={profile.name} job={profile.job} />
						</Section>
					))
				}
			</div>
		</Container>
	)
}

export default ReceptionPage