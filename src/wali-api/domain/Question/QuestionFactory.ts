import Question from './Question'

type QuestionOptions = {
    field : string,
    question : string,
    value: string,
    type: string,
    comparison?: string
    // depends?: string
}

export default abstract class QuestionFactory
{
    static build(options : QuestionOptions)
    {
        let question = new Question(
            options.field,
            options.question,
            options.value,
            options.type,
            options.comparison
        )

        // if (options.value) {
        //     question.value = options.value
        // }
        //
        // if (options.type) {
        //     question.type = options.type
        // }
        //
        // if (options.depends) {
        //     question.depends = options.depends
        // }

        return question
    }
}
