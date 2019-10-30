# Install

1. Navigate to root folder and run ``` npm install ```
2. Open a separate terminal and run ``` tsc -w ``` from the root folder. This will hot reload the typescript compiler.
3. Run ``` npm run start ``` or ``` npm run watch ``` to run the server


# Usage

### 1. Authenticate
    - POST: "/auth/login"
        - **Request**:
        ```
        {
            email: "mihai@muzmatch.com"
        }
        ```
        - **Response**:
        ```
        true
        ```
    - POST: "/auth/validate-password"
        - **Request**:
        ```
        {
            password: "123456"
        }
        ```
        - **Response**:
        ```
        {
            active: 1,
            created_at: "2019-05-17T09:12:42.000Z",
            description: "This is the description",
            email: "mihai@muzmatch.com",
            firstName: "Mihai",
            id: 1,
            lastName: "Blebea",
            picture: null,
            roles: [
                {
                    created_at: "2019-05-14T12:01:01.000Z",
                    id: 3,
                    productName: "approve",
                    roleDescription: "just approve",
                    roleName: "Admin",
                    updated_at: "2019-05-14T12:01:01.000Z",
                }
            ],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek",
            updated_at: "2019-05-18T21:34:56.000Z"
        }
        ```

### 2. Member
    - GET: "/member/approve"
        - **Request**:
        ```
        {
            null
        }
        ```
        - **Response**:
        ```
        {
            member: {
                complete: { _level: 1 },
                description: null,
                id: 11542,
                images: [
                    {
                        isVerification: false,
                        path: "ZGNiYmFlYjEtMDEyNy00NzdlLWI0MzctMTA4YzlmOTFhY2Q4",
                        type: "photo1"
                    },
                    {
                        isVerification: true,
                        path: "ZGU4YmIxNjUtY2MxMC00Nzk4LTg5MWItYzQ4YTM0NTA1MTJj",
                        type: "photoVerification"
                    }
                ],
                nickname: "A",
                permanentlyBlocked: 0,
                status: null,
                timeStamp: "2018-10-08T16:12:48.000Z"
            },
            questions: [
                {
                    comparison: "ZGNiYmFlYjEtMDEyNy00NzdlLWI0MzctMTA4YzlmOTFhY2Q4",
                    field: "photoVerification",
                    question: "🤳 Is this selfie genuine and clearly of their face?",
                    type: "comparison",
                    value: "ZGU4YmIxNjUtY2MxMC00Nzk4LTg5MWItYzQ4YTM0NTA1MTJj"
                },
                {
                    field: "photo1",
                    question: "👙 Is this photo free from offensive material or nudity (not shirtless)?",
                    type: "photo",
                    value: "ZGNiYmFlYjEtMDEyNy00NzdlLWI0MzctMTA4YzlmOTFhY2Q4"
                }
            ]
        }
        ```
    - POST: "/member/approve"
        - **Request**:
        ```
        {
            memberId: 1234,
            answers: [
                { answer: "yes", field: "photo1" },
                { answer: "no", field: "photo2" },
                { answer: "yes", field: "photo3" },
                { answer: "yes", field: "photo4" }
            ]
        }
        ```
        - **Response**:
        ```
        true / false
        ```
    - GET: "/member/approve/pending"
        - **Request**:
        ```
        null
        ```
        - **Response**:
        ```
        89
        ```

### 3. Staff
    - POST: "/staff/store"
        - **Request**:
        ```
        {
            roles: [3],
            firstName: "Mihai",
            lastName: "Blebea",
            email: "mihai@muzmatch.com"
        }
        ```
        - **Response**:
        ```
        {
            active: 1,
            created_at: "2019-05-17T09:12:42.000Z",
            description: "This is the description",
            email: "mihai@muzmatch.com",
            firstName: "Mihai",
            id: 1,
            lastName: "Blebea",
            picture: null,
            roles: [
                {
                    created_at: "2019-05-14T12:01:01.000Z",
                    id: 3,
                    productName: "approve",
                    roleDescription: "just approve",
                    roleName: "Admin",
                    updated_at: "2019-05-14T12:01:01.000Z",
                }
            ],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek",
            updated_at: "2019-05-18T21:34:56.000Z"
        }
        ```
    - GET: "/staff/update"
        - **Request**:
        ```
        {
            id: 1,
            roles: [2, 3],
            firstName: "Mihai222",
            lastName: "Blebea",
            email: "mihai@muzmatch.com"
        }
        ```
        - **Response**:
        ```
        {
            active: 1,
            created_at: "2019-05-17T09:12:42.000Z",
            description: "This is the description",
            email: "mihai@muzmatch.com",
            firstName: "Mihai222",
            id: 1,
            lastName: "Blebea",
            picture: null,
            roles: [
                {
                    created_at: "2019-05-14T12:01:01.000Z",
                    id: 3,
                    productName: "approve",
                    roleDescription: "just approve",
                    roleName: "Admin",
                    updated_at: "2019-05-14T12:01:01.000Z",
                }
            ],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek",
            updated_at: "2019-05-18T21:34:56.000Z"
        }
        ```
    - GET: "/staff/collection"
        - **Request**:
        ```
        null
        ```
        - **Response**:
        ```
        [
            {
                active: 1,
                created_at: "2019-05-17T09:12:42.000Z",
                description: "This is the description",
                email: "mihai@muzmatch.com",
                firstName: "Mihai",
                id: 1,
                lastName: "Blebea",
                picture: null,
                roles: [
                    {
                        created_at: "2019-05-14T12:01:01.000Z",
                        id: 3,
                        productName: "approve",
                        roleDescription: "just approve",
                        roleName: "Admin",
                        updated_at: "2019-05-14T12:01:01.000Z",
                    }
                ],
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek",
                updated_at: "2019-05-18T21:34:56.000Z"
            }
        ]
        ```
    - GET: "/staff/search"
       - **Request**:
       ```
       {
           token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek"
       }
       ```
       - **Response**:
       ```
       {
           active: 1,
           created_at: "2019-05-17T09:12:42.000Z",
           description: "This is the description",
           email: "mihai@muzmatch.com",
           firstName: "Mihai",
           id: 1,
           lastName: "Blebea",
           picture: null,
           roles: [
               {
                   created_at: "2019-05-14T12:01:01.000Z",
                   id: 3,
                   productName: "approve",
                   roleDescription: "just approve",
                   roleName: "Admin",
                   updated_at: "2019-05-14T12:01:01.000Z",
               }
           ],
           token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InBhc3N3b3JkIjoiNzc3Nzc3IiwiZW1haWwiOiJtaWhhaUBtdXptYXRjaC5jb20ifSwiaWF0IjoxNTU4MzQ2Mjg1LCJleHAiOjE1NTgzNDk4ODV9.FAM444UcQDOKuvuNsGytBjbcXPmX6dTTbK5JomutVek",
           updated_at: "2019-05-18T21:34:56.000Z"
       }
       ```
   - GET: "/staff/remove?id=1"
      - **Request**:
      ```
      null
      ```
      - **Response**:
      ```
      null
      ```

4. Role
