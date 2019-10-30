import container from './connection'
import commandContainer from './commands'
import queryContainer from './queries'
import serviceContainer from './services'
import infrastructureContainer from './infrastructure'


// Combine all the containers in one here
container.merge(commandContainer)
         .merge(queryContainer)
         .merge(serviceContainer)
         .merge(infrastructureContainer)

export default container
