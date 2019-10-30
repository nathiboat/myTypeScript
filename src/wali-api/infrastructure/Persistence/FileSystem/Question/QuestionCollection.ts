import { Question, Member, QuestionFactory } from '../../../../domain'

type JsonQuestion = { [key: string]: any }

export default class QuestionCollection
{

    private _jsonQuestions : any = {}

    private _questionsFilePath : string = './../../../../../../store/questions/'

    constructor()
    {
        //
    }

    private async initialize()
    {
         let questions = await import(`${ this._questionsFilePath }/questions.json`)
         this._jsonQuestions = questions.default
    }

    async execute(member: Member)
    {
        // init the opbject state
        await this.initialize()

        // get the member selfie image
        let memberSelfie = member.verificationImage[0]

        // initialize the array holding all the questions
        let questions : Question[] = []

        this._jsonQuestions.forEach((question : JsonQuestion)=> {
            if(question.case === 'photoVerification')
            {
                // Only push image questions if the user has any images
                if (member.memberImages && member.memberImages.length > 0) {
                    questions.push(QuestionFactory.build({
                        field: question.case,
                        value: memberSelfie.name,
                        question: question.question,
                        type: 'comparison',
                        comparison: member.memberImages[0].name
                    }))
                }
            }

            if(question.case === 'photo' && member.memberImages.length > 0)
            {
                member.memberImages.forEach((image, index)=> {

                    questions.push(QuestionFactory.build({
                        field: `${ question.case }${ index + 1 }`,
                        value: image.name,
                        question: question.question,
                        type: 'photo'
                    }))

                })
            }

            if(question.case === 'statusMessage' && member.status)
            {
                questions.push(QuestionFactory.build({
                    field: question.case,
                    value: member.status,
                    question: question.question,
                    type: 'text'
                }))
            }

            if(question.case === 'longDescription' && member.description)
            {
                questions.push(QuestionFactory.build({
                    field: question.case,
                    value: member.description,
                    question: question.question,
                    type: 'text'
                }))
            }
        })

        return questions

    }
}
