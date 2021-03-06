import { Collection, MongoClient } from 'mongodb'

type Client = null | MongoClient

export const MongoHelper = {
  client: null as Client,

  uri: null as string | null,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.uri = uri
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },

  map  (collection: any): any {
    const { _id, ...collectionWithoutId } = collection

    return { ...collectionWithoutId, id: _id }
  }

}
