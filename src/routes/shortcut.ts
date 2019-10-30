import express, { Request, Response } from "express";
import container from "../shortcut-tool/Infrastructure/DependencyContainer/Container";
import { authMiddleware } from './../middlewares/NewAuthMiddleware'

const router = express.Router();

router.get("/all", authMiddleware('shortcut2', 'admin-shortcut'), async (request: Request, response: Response) => {
  try {
    let service = container.get("GetShortcuts");
    let result = await service.execute("all");
    return response.status(200).json(result);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

router.get("/deleted", async (request: Request, response: Response) => {
  try {
    let service = container.get("GetShortcuts");
    let result = await service.execute("deleted");
    return response.status(200).json(result);
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

router.post("/create", async (request: Request, response: Response) => {
  try {
    let { name, keys, content } = request.body;
    if (typeof name !== "string") throw new Error("name is not a string");
    if (typeof keys !== "string")
      throw new Error("keys is not a string");
    if (typeof content !== "string")
      throw new Error("content is not a string");

    let service = container.get("PostShortcut");
    await service.execute(name, keys, content, false);
    return response.status(200).end();
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

router.post("/delete/:id", async (request: Request, response: Response) => {
  try {
    let queryId = parseInt(request.params.id);
    if (Number.isNaN(queryId)) throw new Error("queryId is not a number");

    let service = container.get("DeleteShortcut");
    await service.execute(queryId);
    return response.status(200).end();
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

router.post("/restore/:id", async (request: Request, response: Response) => {
  try {
    let queryId = parseInt(request.params.id);
    if (Number.isNaN(queryId)) throw new Error("queryId is not a number");

    let service = container.get("RestoreShortcut");
    await service.execute(queryId);
    return response.status(200).end();
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

router.post("/update/:id", async (request: Request, response: Response) => {
  try {
    let queryId = parseInt(request.params.id);
    if (Number.isNaN(queryId)) throw new Error("queryId is not a number");

    let { name, keys, content } = request.body;
    if (typeof name !== "string") throw new Error("name is not a string");
    if (typeof keys !== "string")
      throw new Error("keys is not a string");
    if (typeof content !== "string")
      throw new Error("content is not a string");

    let service = container.get("UpdateShortcut");
    await service.execute(name, keys, content, false, queryId);
    return response.status(200).end();
  } catch (error) {
    console.log(error);
    return response.status(400).send(error.message);
  }
});

export default router;
